import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Token is valid',
      user: {
        id: auth.userId,
        email: auth.email,
        role: auth.role,
      },
    });
  } catch (error: any) {
    console.error('Admin auth verify error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
} 