import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Newsletter from '@/models/Newsletter'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find and unsubscribe
    const subscription = await Newsletter.findOne({ email: email.toLowerCase() })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Email not found in our newsletter subscriptions' },
        { status: 404 }
      )
    }

    if (!subscription.subscribed) {
      return NextResponse.json(
        { error: 'Email is already unsubscribed' },
        { status: 400 }
      )
    }

    subscription.subscribed = false
    subscription.unsubscribedAt = new Date()
    await subscription.save()

    return NextResponse.json({
      message: 'Successfully unsubscribed from newsletter',
      subscription
    })

  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
