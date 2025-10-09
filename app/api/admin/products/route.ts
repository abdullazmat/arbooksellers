import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// GET - Get all products for admin
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Verify database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }

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
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (featured === "true") {
      query.featured = true;
    }
    if (category) {
      try {
        query.category = new mongoose.Types.ObjectId(category);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid category ID format" },
          { status: 400 }
        );
      }
    }
    if (subcategory) {
      try {
        query.subcategory = new mongoose.Types.ObjectId(subcategory);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid subcategory ID format" },
          { status: 400 }
        );
      }
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { size: { $regex: search, $options: "i" } },
        { paper: { $regex: search, $options: "i" } },
        { binding: { $regex: search, $options: "i" } },
      ];
    }

    // Get products with category population
    let products;
    try {
      products = await Product.find(query)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    } catch (populateError: any) {
      console.error("Error populating products:", populateError);
      // Fallback to products without population
      products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    }

    // Get total count
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Admin products GET error:", error);

    // Handle specific error types
    if (error.name === "MongoNetworkError") {
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: "Unable to connect to the database",
        },
        { status: 503 }
      );
    }

    if (error.name === "MongoServerError") {
      return NextResponse.json(
        {
          error: "Database server error",
          details: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Verify database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }

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
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Check content length before parsing
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) {
      // 50MB limit to accommodate larger images
      return NextResponse.json(
        {
          error: "Request too large",
          details:
            "The request is too large (max 50MB). Please reduce image sizes or remove some images.",
        },
        { status: 413 }
      );
    }

    let productData;
    try {
      productData = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid JSON",
          details: "The request body contains invalid JSON data.",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!productData.title || !productData.author || !productData.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if images are too large (base64 images can be very large)
    if (productData.images && Array.isArray(productData.images)) {
      const totalImageSize = productData.images.reduce(
        (total: number, image: string) => {
          if (image.startsWith("data:image")) {
            // Base64 images are ~33% larger than the original
            return total + image.length * 0.75;
          }
          return total;
        },
        0
      );

      if (totalImageSize > 40 * 1024 * 1024) {
        // 40MB total image limit to accommodate larger images
        return NextResponse.json(
          {
            error: "Images too large",
            details:
              "Total image size exceeds 40MB. Please reduce image sizes or remove some images.",
          },
          { status: 413 }
        );
      }

      // Check individual image size
      for (let i = 0; i < productData.images.length; i++) {
        const image = productData.images[i];
        if (image.startsWith("data:image")) {
          const imageSize = image.length * 0.75; // Approximate original size
          if (imageSize > 20 * 1024 * 1024) {
            // 20MB per image limit
            return NextResponse.json(
              {
                error: "Image too large",
                details: `Image ${i + 1} is too large (max 20MB per image). Please compress the image.`,
              },
              { status: 413 }
            );
          }
        }
      }
    }

    // Convert category fields to ObjectIds if they exist
    if (productData.category) {
      productData.category = new mongoose.Types.ObjectId(productData.category);
    }
    if (productData.subcategory) {
      productData.subcategory = new mongoose.Types.ObjectId(
        productData.subcategory
      );
    }

    const product = new Product(productData);
    await product.save();

    // Populate categories for response
    let populatedProduct;
    try {
      populatedProduct = await Product.findById(product._id)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .lean();
    } catch (populateError: any) {
      // Return product without population if populate fails
      populatedProduct = await Product.findById(product._id).lean();
    }

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: {
          ...populatedProduct,
          category: productData.category || null,
          subcategory: productData.subcategory || null,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin products POST error:", error);

    // Handle specific error types
    if (error.name === "MongoNetworkError") {
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: "Unable to connect to the database",
        },
        { status: 503 }
      );
    }

    if (error.name === "MongoServerError") {
      return NextResponse.json(
        {
          error: "Database server error",
          details: error.message,
        },
        { status: 503 }
      );
    }

    // Handle request size errors
    if (error.message && error.message.includes("too large")) {
      return NextResponse.json(
        {
          error: "Request too large",
          details:
            "The product data is too large. Please reduce image sizes or remove some images.",
        },
        { status: 413 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: "The request data is not valid JSON",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
