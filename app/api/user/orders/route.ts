import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;
    const query: any = { user: auth.userId };

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find({ user: auth.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product', 'title images')
      .lean();

    // Transform orders to include orderNumber and normalize address
    const transformedOrders = orders.map(o => ({
      ...o,
      shippingAddress: {
        ...o.shippingAddress,
        street: o.shippingAddress.address || o.shippingAddress.street || 'N/A'
      }
    }));

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get user orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 