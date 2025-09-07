import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';
import Category from '@/models/Category';
import { verifyAuth } from '@/lib/auth';

// GET - Get all categories with subcategories
export async function GET(request: NextRequest) {
  try {
    console.log('Admin categories API called');
    
    await dbConnect();
    console.log('Database connected successfully');

    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

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
    const parentCategories = allCategories.filter(cat => !cat.parent);
    const subcategories = allCategories.filter(cat => cat.parent);

    // Attach subcategories to their parents
    const organizedCategories = parentCategories.map(parent => ({
      ...parent,
      subcategories: subcategories.filter(sub => 
        sub.parent && sub.parent.toString() === (parent._id as any).toString()
      )
    }));

    return NextResponse.json({
      categories: organizedCategories,
      total: allCategories.length,
    });

  } catch (error: any) {
    console.error('Get admin categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const categoryData = await request.json();

    // Validate required fields
    if (!categoryData.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if parent category exists (if provided)
    if (categoryData.parent) {
      const parentCategory = await Category.findById(categoryData.parent);
      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 400 }
        );
      }
    }

    // Create category
    const category = new Category(categoryData);
    await category.save();

    // If this is a subcategory, add it to parent's subcategories array
    if (categoryData.parent) {
      await Category.findByIdAndUpdate(
        categoryData.parent,
        { $addToSet: { subcategories: category._id } }
      );
    }

    // Populate the response
    const populatedCategory = await Category.findById(category._id)
      .populate('subcategories')
      .populate('parent');

    return NextResponse.json({
      message: 'Category created successfully',
      category: populatedCategory,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create category error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
