import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json(
        { error: "Database not connected" },
        { status: 503 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "4");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const currentProduct = await Product.findById(id).lean();
    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Build the query:
    // Exclude the current product
    const query: any = { _id: { $ne: new mongoose.Types.ObjectId(id) } };

    // Try to match by subcategory first, then category
    if (currentProduct.subcategory) {
      query.subcategory = currentProduct.subcategory;
    } else if (currentProduct.category) {
      query.category = currentProduct.category;
    }

    let products = await Product.find(query)
      .select('_id title author price originalPrice images inStock category subcategory rating')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // If we couldn't find any by category, fallback to just finding the newest items
    if (products.length === 0) {
      delete query.subcategory;
      delete query.category;
      products = await Product.find(query)
        .select('_id title author price originalPrice images inStock category subcategory rating')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    }

    // Fetch categories to populate if needed
    let categoryMap = new Map();
    try {
      const categoryIds = [...new Set([
        ...products.map((p: any) => p.category).filter(Boolean),
        ...products.map((p: any) => p.subcategory).filter(Boolean)
      ])];
      
      if (categoryIds.length > 0) {
        const categories = await Category.find({ _id: { $in: categoryIds } })
          .select('_id name slug')
          .lean();
        categoryMap = new Map(categories.map((cat: any) => [cat._id.toString(), cat]));
      }
    } catch (catError) {
      // Ignore
    }

    const enrichedProducts = products.map((p: any) => ({
        ...p,
        category: p.category ? categoryMap.get(p.category.toString()) : null,
        subcategory: p.subcategory ? categoryMap.get(p.subcategory.toString()) : null,
    }));

    return NextResponse.json({ products: enrichedProducts });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
