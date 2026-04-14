import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";
import { generateOrderNumber, formatPrice } from "@/lib/utils";
import nodemailer from "nodemailer";
import { APP_CONFIG } from "@/lib/config";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "contact@arbooksellers.com",
    pass: process.env.SMTP_PASSWORD || "",
  },
});

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const orderData = await request.json();

    // Debug logging
    console.log('Received order data:', {
      items: orderData.items?.length,
      shippingAddress: !!orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost,
      total: orderData.total
    });

    // Validate required fields
    const requiredFields = ['items', 'shippingAddress', 'paymentMethod', 'subtotal', 'shippingCost', 'total'];
    for (const field of requiredFields) {
      if (orderData[field] === undefined || orderData[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Additional validation for numeric fields
    if (typeof orderData.shippingCost !== 'number' || isNaN(orderData.shippingCost) || orderData.shippingCost < 0) {
      return NextResponse.json(
        { error: 'Invalid shipping cost value' },
        { status: 400 }
      );
    }

    if (typeof orderData.subtotal !== 'number' || isNaN(orderData.subtotal) || orderData.subtotal < 0) {
      return NextResponse.json(
        { error: 'Invalid subtotal value' },
        { status: 400 }
      );
    }

    if (typeof orderData.total !== 'number' || isNaN(orderData.total) || orderData.total < 0) {
      return NextResponse.json(
        { error: 'Invalid total value' },
        { status: 400 }
      );
    }
    
    // Create order with user ID from token
    const orderNumber = generateOrderNumber();
    
    // Validate order number
    if (!orderNumber || orderNumber.length !== 6 || isNaN(parseInt(orderNumber))) {
      console.error('Invalid order number generated:', orderNumber);
      return NextResponse.json(
        { error: 'Failed to generate valid order number' },
        { status: 500 }
      );
    }
    
    // Create order data with orderNumber
    const orderDataWithNumber = {
      ...orderData,
      user: decoded.userId,
      orderNumber: orderNumber,
    };
    
    // Create and save the order
    const order = new Order(orderDataWithNumber);
    let savedOrder;
    
    try {
      await order.save();
      savedOrder = await Order.findById(order._id).lean();
      
      if (!savedOrder?.orderNumber) {
        throw new Error('Failed to save order number');
      }
    } catch (saveError: any) {
      console.error('Error saving order:', saveError);
      if (saveError.code === 11000) {
        const newOrderNumber = generateOrderNumber();
        order.orderNumber = newOrderNumber;
        await order.save();
        savedOrder = await Order.findById(order._id).lean();
      } else {
        throw saveError;
      }
    }

    // Send Emails (Don't await to avoid blocking the user response)
    const sendEmails = async () => {
      try {
        const { getOrderConfirmationEmail, getAdminOrderNotificationEmail } = await import('@/lib/email-templates');
        
        // 1. Email to Customer
        await transporter.sendMail({
          from: `"AR Book Sellers" <${process.env.SMTP_USER || "contact@arbooksellers.com"}>`,
          to: savedOrder.shippingAddress.email,
          subject: `Order Confirmed: #${savedOrder.orderNumber} - AR Book Sellers`,
          html: getOrderConfirmationEmail(savedOrder),
        });

        // 2. Email to Admin
        await transporter.sendMail({
          from: `"System Notification" <${process.env.SMTP_USER || "contact@arbooksellers.com"}>`,
          to: "contact@arbooksellers.com",
          subject: `NEW ORDER: #${savedOrder.orderNumber} from ${savedOrder.shippingAddress.fullName}`,
          html: getAdminOrderNotificationEmail(savedOrder),
        });

      } catch (err: any) {
        console.error('Email notification failed:', err.message);
      }
    };

    // Execute email sending in background
    sendEmails();

    return NextResponse.json({
      message: 'Order created successfully',
      order: savedOrder,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get user orders
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: decoded.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items.product", "title images")
      .lean();

    const total = await Order.countDocuments({ user: decoded.userId });

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
