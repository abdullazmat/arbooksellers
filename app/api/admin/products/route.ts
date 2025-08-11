import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const skip = (page - 1) * limit;
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const productData = await request.json();

    const product = new Product(productData);
    await product.save();

    return NextResponse.json({
      message: 'Product created successfully',
      product,
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 