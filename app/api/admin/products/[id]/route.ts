import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// GET - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
        { status: 401 },
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Get admin product error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
        { status: 401 },
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Increased limit for JSON body to 50MB to accommodate legacy products with multiple base64 images.
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Request too large",
          details: "The request is too large. Max allowed is 50MB.",
        },
        { status: 413 },
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
        { status: 400 },
      );
    }

    // Find product first so we can validate image updates against existing data.
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Validate required fields
    if (!productData.title || !productData.author || !productData.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Images must be URLs only (no base64). Upload via /api/upload first.
    if (productData.images && Array.isArray(productData.images)) {
      const existingLegacyImages = new Set(
        (existingProduct.images || []).filter(
          (img: unknown): img is string =>
            typeof img === "string" && img.startsWith("data:"),
        ),
      );

      for (let i = 0; i < productData.images.length; i++) {
        const image = productData.images[i];
        if (typeof image !== "string") {
          return NextResponse.json(
            {
              error: "Invalid images",
              details: `Image ${i + 1} must be a URL string. Upload images via the upload API first.`,
            },
            { status: 400 },
          );
        }
        if (image.startsWith("data:")) {
          // Backward compatibility: allow unchanged legacy base64 images already stored.
          if (existingLegacyImages.has(image)) {
            continue;
          }

          return NextResponse.json(
            {
              error: "Base64 images not allowed",
              details:
                "Do not paste image data. Upload images using the product form; they will be converted to WebP and stored by URL.",
            },
            { status: 400 },
          );
        }
      }
    }

    // Convert category fields to ObjectIds if they exist
    if (productData.category) {
      productData.category = new mongoose.Types.ObjectId(productData.category);
    }
    if (productData.subcategory) {
      productData.subcategory = new mongoose.Types.ObjectId(
        productData.subcategory,
      );
    }

    // Update product
    let product = existingProduct;
    try {
      // Update basic fields
      Object.assign(product, productData);

      await product.save();

      // Population after save
      product = await Product.findById(id)
        .populate("category", "name slug")
        .populate("subcategory", "name slug");
    } catch (saveError: any) {
      console.error("Save error:", saveError);
      return NextResponse.json(
        { error: "Failed to update product", details: saveError.message },
        { status: 500 },
      );
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Product updated successfully",
      product: {
        ...product.toObject(),
        category: productData.category || null,
        subcategory: productData.subcategory || null,
      },
    });
  } catch (error: any) {
    console.error("Update admin product error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Find and delete product
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete admin product error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
