import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import Category from '@/models/Category'
import { verifyToken } from '@/lib/auth'
import mongoose from 'mongoose'

// GET - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Verify database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params

    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })

  } catch (error: any) {
    console.error('Get admin product error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    // Verify database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params
    const productData = await request.json()

    // Validate required fields
    if (!productData.title || !productData.author || !productData.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert category fields to ObjectIds if they exist
    if (productData.category) {
      productData.category = new mongoose.Types.ObjectId(productData.category);
    }
    if (productData.subcategory) {
      productData.subcategory = new mongoose.Types.ObjectId(productData.subcategory);
    }

    // Find and update product
    let product;
    try {
      product = await Product.findByIdAndUpdate(
        id,
        productData,
        { new: true, runValidators: true }
      )
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
    } catch (populateError: any) {
      // Fallback to product without population
      product = await Product.findByIdAndUpdate(
        id,
        productData,
        { new: true, runValidators: true }
      );
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product: {
        ...product.toObject(),
        category: productData.category || null,
        subcategory: productData.subcategory || null,
      },
    })

  } catch (error: any) {
    console.error('Update admin product error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params

    // Find and delete product
    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Product deleted successfully',
    })

  } catch (error: any) {
    console.error('Delete admin product error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}