import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";

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

    // Validate required fields
    const requiredFields = ['items', 'shippingAddress', 'paymentMethod', 'subtotal', 'shippingCost', 'total'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
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
    
    try {
      await order.save();
      
      // Fetch the saved order to ensure all fields are present
      const savedOrder = await Order.findById(order._id);
      
      if (!savedOrder?.orderNumber) {
        console.error('CRITICAL: Order number still missing after save');
        throw new Error('Failed to save order number');
      }
      
      return NextResponse.json({
        message: 'Order created successfully',
        order: savedOrder,
      }, { status: 201 });
      
    } catch (saveError: any) {
      console.error('Error saving order:', saveError);
      
      // If there's a duplicate key error, try with a different order number
      if (saveError.code === 11000) {
        console.error('Duplicate order number error - trying again');
        
        // Generate a new order number
        const newOrderNumber = generateOrderNumber();
        
        try {
          // Update the order with new order number
          order.orderNumber = newOrderNumber;
          await order.save();
          
          // Fetch the saved order
          const retryOrder = await Order.findById(order._id);
          
          if (retryOrder && retryOrder.orderNumber) {
            return NextResponse.json({
              message: 'Order created successfully',
              order: retryOrder,
            }, { status: 201 });
          } else {
            throw new Error('Failed to save order with new order number');
          }
        } catch (retryError) {
          console.error('Retry failed:', retryError);
          throw retryError;
        }
      }
      
      throw saveError;
    }
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
