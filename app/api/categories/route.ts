import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

// GET - Get all active categories with subcategories
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    // Build query
    const query: any = {};
    if (!includeInactive) {
      query.isActive = true;
    }

    // Fetch all categories
    const allCategories = await Category.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Organize categories into parent-child structure
    const parentCategories = allCategories.filter((cat) => !cat.parent);
    const subcategories = allCategories.filter((cat) => cat.parent);

    // Attach subcategories to their parents
    const organizedCategories = parentCategories.map((parent) => ({
      ...parent,
      subcategories: subcategories.filter(
        (sub) =>
          sub.parent && sub.parent.toString() === (parent._id as any).toString()
      ),
    }));

    return NextResponse.json({
      categories: organizedCategories,
      total: allCategories.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
