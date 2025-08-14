import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comment from '@/models/Comment'
import { verifyAuth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    await dbConnect()
    const { commentId } = await params

    // Verify admin authentication
    const user = verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Find and update the comment
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { isApproved: false },
      { new: true }
    )

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Comment rejected successfully',
      comment,
    })

  } catch (error: any) {
    console.error('Reject comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
