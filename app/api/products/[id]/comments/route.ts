import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comment from '@/models/Comment'
import { verifyAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    // Get approved comments for the product
    const comments = await Comment.find({ 
      productId: id, 
      isApproved: true 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count of approved comments
    const total = await Comment.countDocuments({ 
      productId: id, 
      isApproved: true 
    })

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
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    // Verify user authentication
    const user = verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { content, rating } = await request.json()

    // Validate input
    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters long' },
        { status: 400 }
      )
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if user already commented on this product
    const existingComment = await Comment.findOne({
      productId: id,
      userId: user.userId,
    })

    if (existingComment) {
      return NextResponse.json(
        { error: 'You have already commented on this product' },
        { status: 400 }
      )
    }

    // Create new comment
    const comment = new Comment({
      productId: id,
      userId: user.userId,
      userName: user.email.split('@')[0], // Use email prefix as username
      userEmail: user.email,
      content: content.trim(),
      rating: rating || 5,
      isApproved: true, // Automatically approve comments
    })

    await comment.save()

    return NextResponse.json({
      message: 'Comment submitted successfully',
      comment,
    })

  } catch (error: any) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
