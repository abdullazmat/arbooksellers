import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    await dbConnect();
    console.log('Database connected successfully');
    
    return NextResponse.json({
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
