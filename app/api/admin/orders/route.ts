import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';

// GET - Get all orders with stats
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
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }
    if (search) {
      query.$or = [
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } },
      ];
    }

    // Get orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('items.product', 'title images')
      .lean();

    console.log('Admin orders API - Raw orders from database:', orders);
    console.log('First order orderNumber:', orders[0]?.orderNumber);
    console.log('First order _id:', orders[0]?._id);

    // Get total count
    const total = await Order.countDocuments(query);

    // Get stats
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'processing'] }, 1, 0] }
          },
        }
      }
    ]);

    const orderStats = stats[0] || {
      totalSales: 0,
      totalOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
    };

    return NextResponse.json({
      orders,
      stats: orderStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error: any) {
    console.error('Get admin orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 