import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comment from '@/models/Comment'
import { verifyAuth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    await dbConnect()
    const { id, commentId } = await params

    // Verify user authentication
    const user = await verifyAuth(request)
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

    // Find the comment
    const comment = await Comment.findById(commentId)
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check if user owns the comment
    if (comment.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' },
        { status: 403 }
      )
    }

    // Update comment
    comment.content = content.trim()
    comment.rating = rating || comment.rating
    comment.isEdited = true
    comment.editedAt = new Date()
    comment.isApproved = false // Reset approval status after edit

    await comment.save()

    return NextResponse.json({
      message: 'Comment updated successfully and awaiting approval',
      comment,
    })

  } catch (error: any) {
    console.error('Update comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    await dbConnect()
    const { id, commentId } = await params

    // Verify user authentication
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Find the comment
    const comment = await Comment.findById(commentId)
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    // Check if user owns the comment
    if (comment.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 403 }
      )
    }

    // Delete comment
    await Comment.findByIdAndDelete(commentId)

    return NextResponse.json({
      message: 'Comment deleted successfully',
    })

  } catch (error: any) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
