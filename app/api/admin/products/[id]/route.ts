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
    
    // Check content length before parsing
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
      // 5MB limit for better performance
      return NextResponse.json(
        {
          error: "Request too large",
          details:
            "The request is too large (max 5MB). Please reduce image sizes or remove some images.",
        },
        { status: 413 }
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
        { status: 400 }
      );
    }

    // Validate required fields
    if (!productData.title || !productData.author || !productData.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if images are too large (base64 images can be very large)
    if (productData.images && Array.isArray(productData.images)) {
      const totalImageSize = productData.images.reduce(
        (total: number, image: string) => {
          if (image.startsWith("data:image")) {
            // Base64 images are ~33% larger than the original
            return total + image.length * 0.75;
          }
          return total;
        },
        0
      );

      if (totalImageSize > 3 * 1024 * 1024) {
        // 3MB total image limit for better performance
        return NextResponse.json(
          {
            error: "Images too large",
            details:
              "Total image size exceeds 3MB. Please reduce image sizes or remove some images.",
          },
          { status: 413 }
        );
      }

      // Check individual image size
      for (let i = 0; i < productData.images.length; i++) {
        const image = productData.images[i];
        if (image.startsWith("data:image")) {
          const imageSize = image.length * 0.75; // Approximate original size
          if (imageSize > 1 * 1024 * 1024) {
            // 1MB per image limit
            return NextResponse.json(
              {
                error: "Image too large",
                details: `Image ${i + 1} is too large (max 1MB per image). Please compress the image.`,
              },
              { status: 413 }
            );
          }
        }
      }
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