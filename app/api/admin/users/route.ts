import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
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
    const role = searchParams.get('role') || '';

    const skip = (page - 1) * limit;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);

    // Calculate stats
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeUsers = await User.countDocuments({ isActive: true });

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        totalUsers,
        totalAdmins,
        activeUsers,
      },
    });
  } catch (error: any) {
    console.error('Get admin users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 