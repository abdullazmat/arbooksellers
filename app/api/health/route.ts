import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await dbConnect();
    
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Test model imports
    let modelsStatus = 'ok';
    try {
      const Product = (await import('@/models/Product')).default;
      const Category = (await import('@/models/Category')).default;
      const User = (await import('@/models/User')).default;
      const Order = (await import('@/models/Order')).default;
      const Comment = (await import('@/models/Comment')).default;
    } catch (error) {
      modelsStatus = 'error';
    }
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      models: {
        status: modelsStatus
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGO_URI,
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    });
    
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
