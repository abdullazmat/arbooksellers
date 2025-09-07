import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

// GET - Get all products for admin
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (featured === 'true') {
      query.featured = true;
    }
    if (category) {
      query.category = category;
    }
    if (subcategory) {
      query.subcategory = subcategory;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { size: { $regex: search, $options: 'i' } },
        { paper: { $regex: search, $options: 'i' } },
        { binding: { $regex: search, $options: 'i' } },
      ]
    }

    // Get products with category population
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
    console.error('Get admin products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const productData = await request.json();
    // Validate required fields
    if (!productData.title || !productData.author || !productData.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert category fields to ObjectIds if they exist
    if (productData.category) {
      productData.category = new mongoose.Types.ObjectId(productData.category);
    }
    if (productData.subcategory) {
      productData.subcategory = new mongoose.Types.ObjectId(productData.subcategory);
    }
    
    const product = new Product(productData);
    await product.save();

    // Populate categories for response
    let populatedProduct;
    try {
      populatedProduct = await Product.findById(product._id)
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .lean();
    } catch (populateError: any) {
      console.error('Error populating product categories:', populateError);
      // Return product without population if populate fails
      populatedProduct = await Product.findById(product._id).lean();
    }

    return NextResponse.json({
      message: 'Product created successfully',
      product: {
        ...populatedProduct,
        category: productData.category || null,
        subcategory: productData.subcategory || null,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 