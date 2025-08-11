import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Product.findById(params.id).lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product,
    });

  } catch (error: any) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 