import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comment from '@/models/Comment'
import { verifyAuth } from '@/lib/auth'

export async function DELETE(
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

    // Find and delete the comment
    const comment = await Comment.findByIdAndDelete(commentId)

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Comment deleted successfully',
    })

  } catch (error: any) {
    console.error('Delete admin comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
