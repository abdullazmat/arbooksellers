import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(auth.userId).select('addresses').lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error: any) {
    console.error('Get user addresses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const addressData = await request.json();

    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $push: { addresses: addressData } },
      { new: true, runValidators: true }
    ).select('addresses');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Address added successfully',
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error('Add user address error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { addressId, addressData } = await request.json();

    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $set: { [`addresses.${addressId}`]: addressData } },
      { new: true, runValidators: true }
    ).select('addresses');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Address updated successfully',
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error('Update user address error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { addressId } = await request.json();

    const user = await User.findByIdAndUpdate(
      auth.userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true, runValidators: true }
    ).select('addresses');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Address deleted successfully',
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error('Delete user address error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 