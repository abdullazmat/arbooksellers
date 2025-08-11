import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Wishlist from '@/models/Wishlist';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get user profile
    const user = await User.findById(auth.userId).select('-password').lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user orders
    const orders = await Order.find({ user: auth.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get user wishlist count
    const wishlist = await Wishlist.findOne({ user: auth.userId }).lean();
    const wishlistCount = wishlist ? wishlist.items.length : 0;

    // Calculate order statistics
    const totalOrders = await Order.countDocuments({ user: auth.userId });
    const completedOrders = await Order.countDocuments({ 
      user: auth.userId, 
      orderStatus: { $in: ['delivered', 'completed'] } 
    });
    const pendingOrders = await Order.countDocuments({ 
      user: auth.userId, 
      orderStatus: { $in: ['pending', 'processing'] } 
    });

    // Calculate total spent
    const totalSpent = await Order.aggregate([
      { $match: { user: auth.userId, orderStatus: { $in: ['delivered', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    return NextResponse.json({
      user,
      stats: {
        totalOrders,
        completedOrders,
        pendingOrders,
        wishlistCount,
        totalSpent: totalSpent[0]?.total || 0,
      },
      recentOrders: orders,
    });
  } catch (error: any) {
    console.error('Get user dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 