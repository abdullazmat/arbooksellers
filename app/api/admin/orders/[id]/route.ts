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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PATCH request received for order:', params.id)
    
    const auth = verifyAuth(request);
    console.log('Auth result:', { 
      hasAuth: !!auth, 
      role: auth?.role,
      userId: auth?.userId 
    })
    
    if (!auth || auth.role !== 'admin') {
      console.log('Auth failed:', { auth, role: auth?.role })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const updateData = await request.json();
    console.log('Update data received:', updateData)

    // Validate that we're only updating allowed fields
    const allowedFields = ['orderStatus', 'paymentStatus', 'trackingNumber', 'notes'];
    const filteredData: any = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    console.log('Filtered data:', filteredData)

    // Validate order status if it's being updated
    if (filteredData.orderStatus) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(filteredData.orderStatus)) {
        console.log('Invalid order status:', filteredData.orderStatus)
        return NextResponse.json({ 
          error: 'Invalid order status' 
        }, { status: 400 });
      }
    }

    // Validate payment status if it's being updated
    if (filteredData.paymentStatus) {
      const validPaymentStatuses = ['pending', 'paid', 'failed'];
      if (!validPaymentStatuses.includes(filteredData.paymentStatus)) {
        console.log('Invalid payment status:', filteredData.paymentStatus)
        return NextResponse.json({ 
          error: 'Invalid payment status' 
        }, { status: 400 });
      }
    }

    console.log('Updating order with data:', filteredData)

    const order = await Order.findByIdAndUpdate(
      params.id,
      filteredData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) {
      console.log('Order not found:', params.id)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('Order updated successfully:', order._id)

    return NextResponse.json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error: any) {
    console.error('Update order status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 