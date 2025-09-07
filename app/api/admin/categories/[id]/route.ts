import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { verifyAuth } from "@/lib/auth";

// GET - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const auth = verifyAuth(request);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const category = await Category.findById(params.id)
      .populate("subcategories")
      .populate("parent");

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const auth = verifyAuth(request);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const updateData = await request.json();

    // Check if parent category exists (if being updated)
    if (updateData.parent) {
      const parentCategory = await Category.findById(updateData.parent);
      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 400 }
        );
      }
    }

    const category = await Category.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("subcategories")
      .populate("parent");

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const auth = verifyAuth(request);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has subcategories
    if (category.subcategories && category.subcategories.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category with subcategories. Please delete subcategories first.",
        },
        { status: 400 }
      );
    }

    // Remove from parent's subcategories array if it's a subcategory
    if (category.parent) {
      await Category.findByIdAndUpdate(category.parent, {
        $pull: { subcategories: category._id },
      });
    }

    await Category.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
