import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Newsletter from '@/models/Newsletter'
import nodemailer from 'nodemailer'
import { getNewsletterWelcomeEmail } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() })

    if (existingSubscription) {
      if (existingSubscription.subscribed) {
        return NextResponse.json(
          { error: 'Email is already subscribed to our newsletter' },
          { status: 400 }
        )
      } else {
        // Resubscribe
        existingSubscription.subscribed = true
        existingSubscription.subscribedAt = new Date()
        existingSubscription.unsubscribedAt = undefined
        await existingSubscription.save()

        // Send Welcome Email
        try {
          await transporter.sendMail({
            from: `"AR Book Sellers" <${process.env.SMTP_USER}>`,
            to: existingSubscription.email,
            subject: "Welcome back to AR Book Sellers!",
            html: getNewsletterWelcomeEmail(existingSubscription.email)
          });
        } catch (e) {
          console.error("Newsletter resubscribe email failed:", e);
        }

        return NextResponse.json({
          message: 'Successfully resubscribed to newsletter',
          subscription: existingSubscription
        })
      }
    }

    // Create new subscription
    const newsletter = new Newsletter({
      email: email.toLowerCase(),
      name: name || undefined,
      subscribed: true,
      subscribedAt: new Date(),
    })

    await newsletter.save()

    // Send Welcome Email
    try {
      await transporter.sendMail({
        from: `"AR Book Sellers" <${process.env.SMTP_USER}>`,
        to: newsletter.email,
        subject: "Welcome to AR Book Sellers!",
        html: getNewsletterWelcomeEmail(newsletter.email)
      });
    } catch (e) {
      console.error("Newsletter subscribe email failed:", e);
    }

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter',
      subscription: newsletter
    })

  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    const subscribed = searchParams.get('subscribed')

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ]
    }

    if (subscribed !== null) {
      query.subscribed = subscribed === 'true'
    }

    // Get subscriptions
    const subscriptions = await Newsletter.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count
    const total = await Newsletter.countDocuments(query)

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error: any) {
    console.error('Get newsletter subscriptions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
