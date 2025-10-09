import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await dbConnect();

    const { categoryId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const subcategory = searchParams.get("subcategory");

    const skip = (page - 1) * limit;

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Build query - check if categoryId is a subcategory
    const categoryDoc = await Category.findById(categoryId);
    const query: any = {};

    if (categoryDoc && categoryDoc.parent) {
      // If it's a subcategory, filter by subcategory field
      query.subcategory = new mongoose.Types.ObjectId(categoryId);
    } else {
      // If it's a main category, filter by category field
      query.category = new mongoose.Types.ObjectId(categoryId);
    }

    if (subcategory) {
      query.subcategory = new mongoose.Types.ObjectId(subcategory);
    }

    // Get products with category population
    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      category,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Get products by category error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
