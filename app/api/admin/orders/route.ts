import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

import { verifyAuth } from "@/lib/auth";

// GET - Get all orders with stats
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Dynamically import models to ensure they are registered
    try {
      const UserModel = (await import("@/models/User")).default;
      const ProductModel = (await import("@/models/Product")).default;
      const OrderModel = (await import("@/models/Order")).default;
    } catch (importError) {
      return NextResponse.json(
        {
          error: "Failed to import models",
          details:
            importError instanceof Error
              ? importError.message
              : "Unknown import error",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Verify models are registered
    if (!mongoose.models.Order) {
      return NextResponse.json(
        {
          error: "Order model not registered",
          availableModels: Object.keys(mongoose.models),
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    if (!mongoose.models.User) {
      return NextResponse.json(
        {
          error: "User model not registered",
          availableModels: Object.keys(mongoose.models),
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    if (!mongoose.models.Product) {
      return NextResponse.json(
        {
          error: "Product model not registered",
          availableModels: Object.keys(mongoose.models),
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (auth.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (status && status !== "all") {
      query.orderStatus = status;
    }
    if (search) {
      query.$or = [
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.email": { $regex: search, $options: "i" } },
      ];
    }

    // Fetch orders with pagination
    let orders;
    try {
      // First try to find orders without populate to test basic query
      const basicOrders = await mongoose.models.Order.find(query).limit(1);

      // Now try with populate
      orders = await mongoose.models.Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email")
        .populate("items.product", "title images price");
    } catch (findError: any) {
      // Check if it's a model registration error
      if (
        findError.message &&
        findError.message.includes("Schema hasn't been registered")
      ) {
        return NextResponse.json(
          {
            error: "Model registration error",
            details: "One or more required models are not properly registered",
            availableModels: Object.keys(mongoose.models),
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to fetch orders",
          details: findError.message || "Database query failed",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Transform orders to include orderNumber and normalize address
    const transformedOrders = orders.map((order: any) => {
      const orderObj = order.toObject();

      // Ensure orderNumber is present
      if (!orderObj.orderNumber) {
        orderObj.orderNumber = `ORD-${orderObj._id
          .toString()
          .slice(-6)
          .toUpperCase()}`;
      }

      // Normalize shipping address
      if (orderObj.shippingAddress) {
        if (
          orderObj.shippingAddress.address &&
          !orderObj.shippingAddress.street
        ) {
          orderObj.shippingAddress.street = orderObj.shippingAddress.address;
        }
      }

      return orderObj;
    });

    // Get total count
    let total;
    try {
      total = await mongoose.models.Order.countDocuments(query);
    } catch (countError: any) {
      total = 0; // Set default value
    }

    // Get stats
    let stats;
    try {
      stats = await mongoose.models.Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$total" },
            totalOrders: { $sum: 1 },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] },
            },
            processingOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "processing"] }, 1, 0] },
            },
          },
        },
      ]);
    } catch (statsError: any) {
      stats = []; // Set default value
    }

    const orderStats = stats[0] || {
      totalSales: 0,
      totalOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
    };

    const response = {
      orders: transformedOrders,
      stats: orderStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    // Return more specific error information
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
