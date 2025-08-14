import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comment from '@/models/Comment'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Verify admin authentication
    const user = verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const isApproved = searchParams.get('isApproved')

    const skip = (page - 1) * limit
    const query: any = {}

    // Search filter
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ]
    }

    // Approval status filter
    if (isApproved !== null) {
      query.isApproved = isApproved === 'true'
    }

    // Get comments with pagination
    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count
    const total = await Comment.countDocuments(query)

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error: any) {
    console.error('Get admin comments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
