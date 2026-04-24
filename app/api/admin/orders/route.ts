import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";

import { verifyAuth } from "@/lib/auth";

// GET - Get all orders with stats
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    await import("@/models/User");
    await import("@/models/Category");

    // Verify models are registered
    if (!mongoose.models.Order) {
      return NextResponse.json(
        {
          error: "Order model not registered",
          availableModels: Object.keys(mongoose.models),
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    if (!mongoose.models.User) {
      return NextResponse.json(
        {
          error: "User model not registered",
          availableModels: Object.keys(mongoose.models),
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    if (!mongoose.models.Product) {
      return NextResponse.json(
        {
          error: "Product model not registered",
          availableModels: Object.keys(mongoose.models),
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (auth.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const category = searchParams.get("category");

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, any> = {};

    if (status && status !== "all") {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.email": { $regex: search, $options: "i" } },
        { orderNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) {
        const parsedStart = new Date(startDate);
        if (!Number.isNaN(parsedStart.getTime())) {
          parsedStart.setHours(0, 0, 0, 0);
          query.createdAt.$gte = parsedStart;
        }
      }

      if (endDate) {
        const parsedEnd = new Date(endDate);
        if (!Number.isNaN(parsedEnd.getTime())) {
          parsedEnd.setHours(23, 59, 59, 999);
          query.createdAt.$lte = parsedEnd;
        }
      }

      if (Object.keys(query.createdAt).length === 0) {
        delete query.createdAt;
      }
    }

    if (category && category !== "all") {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return NextResponse.json(
          { error: "Invalid category filter" },
          { status: 400 },
        );
      }

      const matchedProducts = await Product.find({
        $or: [{ category }, { subcategory: category }],
      })
        .select("_id")
        .lean();

      const productIds = matchedProducts.map((product) => product._id);
      if (productIds.length === 0) {
        return NextResponse.json({
          orders: [],
          stats: {
            totalSales: 0,
            totalOrders: 0,
            pendingOrders: 0,
            processingOrders: 0,
          },
          pagination: {
            page,
            limit,
            total: 0,
            pages: 1,
          },
        });
      }

      query["items.product"] = { $in: productIds };
    }

    // Fetch orders with pagination
    let orders;
    try {
      orders = await mongoose.models.Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email")
        .populate("items.product", "title images price category subcategory")
        .lean();
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
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          error: "Failed to fetch orders",
          details: findError.message || "Database query failed",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    // Transform orders to include orderNumber and normalize address
    const transformedOrders = orders.map((order: any) => {
      const orderObj = order;

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
    const total = await mongoose.models.Order.countDocuments(query);

    // Get stats
    const stats = await mongoose.models.Order.aggregate([
      { $match: query },
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
        pages: Math.max(1, Math.ceil(total / limit)),
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
      { status: 500 },
    );
  }
}

// DELETE - Clear order history (all or by active filters)
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const auth = verifyAuth(request);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const category = searchParams.get("category");

    const query: Record<string, any> = {};

    if (status && status !== "all") {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
        { "shippingAddress.email": { $regex: search, $options: "i" } },
        { orderNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) {
        const parsedStart = new Date(startDate);
        if (!Number.isNaN(parsedStart.getTime())) {
          parsedStart.setHours(0, 0, 0, 0);
          query.createdAt.$gte = parsedStart;
        }
      }

      if (endDate) {
        const parsedEnd = new Date(endDate);
        if (!Number.isNaN(parsedEnd.getTime())) {
          parsedEnd.setHours(23, 59, 59, 999);
          query.createdAt.$lte = parsedEnd;
        }
      }

      if (Object.keys(query.createdAt).length === 0) {
        delete query.createdAt;
      }
    }

    if (category && category !== "all") {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return NextResponse.json(
          { error: "Invalid category filter" },
          { status: 400 },
        );
      }

      const matchedProducts = await Product.find({
        $or: [{ category }, { subcategory: category }],
      })
        .select("_id")
        .lean();

      const productIds = matchedProducts.map((product) => product._id);
      if (productIds.length === 0) {
        return NextResponse.json({
          message: "No orders matched the selected filters",
          deletedCount: 0,
        });
      }

      query["items.product"] = { $in: productIds };
    }

    const result = await Order.deleteMany(query);

    return NextResponse.json({
      message: "Order history cleared successfully",
      deletedCount: result.deletedCount || 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
