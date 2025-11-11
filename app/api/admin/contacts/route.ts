import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { Contact } from '@/models/Contact'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    if (mongoose.connection.readyState !== 1) {
      await dbConnect()
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '9', 10), 1), 50)
    const status = searchParams.get('status') || 'all'
    const q = (searchParams.get('q') || '').trim()
    const sort = searchParams.get('sort') || 'newest'

    const query: any = {}
    if (status !== 'all') {
      query.status = status
    }
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { message: { $regex: q, $options: 'i' } },
      ]
    }

    const sortMap: Record<string, any> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      status: { status: 1, createdAt: -1 },
    }
    const sortObj = sortMap[sort] || sortMap.newest

    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      Contact.find(query)
        .select('-__v')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query),
    ])

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch contacts', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}


