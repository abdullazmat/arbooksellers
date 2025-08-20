import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

// GET - Get all orders with stats
export async function GET(request: NextRequest) {
  try {
    console.log('Admin orders API called');
    console.log('Environment check:', {
      hasMongoUri: !!process.env.MONGO_URI,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
    // Test database connection
    try {
      await dbConnect();
      console.log('Database connected successfully');
    } catch (dbError: any) {
      console.error('Database connection failed:', dbError);
      console.error('Database error details:', {
        name: dbError.name,
        message: dbError.message,
        code: dbError.code,
        stack: dbError.stack
      });
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError.message || 'Unable to connect to database',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    const auth = verifyAuth(request);
    if (!auth) {
      console.log('No auth header or invalid auth');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (auth.role !== 'admin') {
      console.log('User is not admin:', auth.role);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('Admin authenticated:', auth.userId);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    console.log('Search params:', { page, limit, status, search });

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

    console.log('Query built:', query);

    // Fetch orders with pagination
    let orders;
    try {
      orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email')
        .populate('items.product', 'title images price');
      console.log('Orders fetched:', orders.length);
    } catch (findError: any) {
      console.error('Error fetching orders:', findError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch orders',
          details: findError.message || 'Database query failed',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Transform orders to include orderNumber and normalize address
    const transformedOrders = orders.map(order => {
      const orderObj = order.toObject();
      
      // Ensure orderNumber is present
      if (!orderObj.orderNumber) {
        orderObj.orderNumber = `ORD-${orderObj._id.toString().slice(-6).toUpperCase()}`;
      }
      
      // Normalize shipping address
      if (orderObj.shippingAddress) {
        if (orderObj.shippingAddress.address && !orderObj.shippingAddress.street) {
          orderObj.shippingAddress.street = orderObj.shippingAddress.address;
        }
      }
      
      return orderObj;
    });

    // Get total count
    let total;
    try {
      total = await Order.countDocuments(query);
      console.log('Total orders count:', total);
    } catch (countError: any) {
      console.error('Error counting orders:', countError);
      total = 0; // Set default value
    }

    // Get stats
    let stats;
    try {
      stats = await Order.aggregate([
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
      console.log('Stats calculated successfully');
    } catch (statsError: any) {
      console.error('Error calculating stats:', statsError);
      stats = []; // Set default value
    }

    const orderStats = stats[0] || {
      totalSales: 0,
      totalOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
    };

    console.log('Stats calculated:', orderStats);

    const response = {
      orders: transformedOrders,
      stats: orderStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    console.log('Response prepared successfully');
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Get admin orders error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    // Return more specific error information
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 