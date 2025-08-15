import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch orders for the authenticated user
    const orders = await Order.find({ user: auth.userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title images price');

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

    return NextResponse.json({
      orders: transformedOrders,
      total: transformedOrders.length
    });
  } catch (error: any) {
    console.error('Get user orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 