import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Wishlist from '@/models/Wishlist';
import Product from '@/models/Product';
import { verifyAuth } from '@/lib/auth';

// GET - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    let wishlist = await Wishlist.findOne({ user: auth.userId });
    
    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = new Wishlist({ user: auth.userId, items: [] });
      await wishlist.save();
    }

    return NextResponse.json({
      wishlist: wishlist.items,
    });

  } catch (error: any) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    let wishlist = await Wishlist.findOne({ user: auth.userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: auth.userId, items: [] });
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 400 }
      );
    }

    // Add item to wishlist
    wishlist.items.push({
      product: productId,
      title: product.title,
      price: product.price,
      image: product.images[0],
      author: product.author,
    });

    await wishlist.save();

    return NextResponse.json({
      message: 'Item added to wishlist',
      wishlist: wishlist.items,
    });

  } catch (error: any) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const wishlist = await Wishlist.findOne({ user: auth.userId });
    
    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      );
    }

    // Remove item from wishlist
    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    );

    await wishlist.save();

    return NextResponse.json({
      message: 'Item removed from wishlist',
      wishlist: wishlist.items,
    });

  } catch (error: any) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 