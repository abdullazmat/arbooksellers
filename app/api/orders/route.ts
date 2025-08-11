import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

// GET - Get user's orders
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Build query
    const query: any = { user: auth.userId };
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product')
      .lean();

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new order
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

    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      notes,
    } = await request.json();

    // Validate required fields
    if (!items || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Create new order
    const order = new Order({
      user: auth.userId,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      notes,
    });

    await order.save();

    // Populate product details for response
    await order.populate('items.product');

    return NextResponse.json({
      message: 'Order created successfully',
      order,
    });

  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 