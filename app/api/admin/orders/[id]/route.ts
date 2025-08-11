import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const order = await Order.findById(params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'title author images')
      .lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Get admin order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = verifyAuth(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const updateData = await request.json();

    const order = await Order.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 