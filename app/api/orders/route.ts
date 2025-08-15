import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log("Database connected successfully");

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

    console.log("User authenticated:", decoded.userId);
    console.log("Order model imported:", Order);
    console.log("Order model schema:", Order.schema);
    console.log("Order model collection name:", Order.collection.name);

    const orderData = await request.json();
    console.log("Order data received:", orderData);

    // Validate required fields
    if (
      !orderData.items ||
      !orderData.shippingAddress ||
      !orderData.paymentMethod
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order with user ID from token
    const orderNumber = generateOrderNumber();
    console.log("Generated order number:", orderNumber);
    console.log("Order number type:", typeof orderNumber);
    console.log("Order number length:", orderNumber.length);

    // Validate order number
    if (
      !orderNumber ||
      orderNumber.length !== 6 ||
      isNaN(parseInt(orderNumber))
    ) {
      console.error("Invalid order number generated:", orderNumber);
      return NextResponse.json(
        { error: "Failed to generate valid order number" },
        { status: 500 }
      );
    }

    const order = new Order({
      ...orderData,
      user: decoded.userId,
      orderNumber: orderNumber,
    });

    console.log("Order object before save:", order);
    console.log("Order orderNumber field:", order.orderNumber);
    console.log("Order validation state:", order.validateSync());

    try {
      await order.save();
      console.log("Order saved successfully with ID:", order._id);
      console.log("Order saved with orderNumber:", order.orderNumber);

      // Verify the saved order
      const savedOrder = await Order.findById(order._id);
      console.log("Retrieved saved order:", savedOrder);
      console.log("Saved order orderNumber:", savedOrder?.orderNumber);

      // If the saved order doesn't have an order number, try to update it
      if (!savedOrder?.orderNumber) {
        console.log("Order saved but orderNumber is missing, updating...");
        await Order.findByIdAndUpdate(order._id, { orderNumber: orderNumber });
        console.log("Order updated with orderNumber:", orderNumber);
      }
    } catch (saveError: any) {
      console.error("Error saving order:", saveError);
      if (saveError.code === 11000) {
        console.error("Duplicate order number error - trying again");
        // Try with a different order number
        const newOrderNumber = generateOrderNumber();
        order.orderNumber = newOrderNumber;
        await order.save();
        console.log("Order saved with new order number:", newOrderNumber);
      } else {
        throw saveError;
      }
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
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
