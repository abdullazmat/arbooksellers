import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/db'
import { Contact } from '@/models/Contact'

export async function POST(request: NextRequest) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await dbConnect()
    }

    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Request too large', details: 'Max request size is 2MB.' },
        { status: 413 }
      )
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { name, email, phone, subject, message } = body || {}

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing fields', details: 'name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (typeof subject !== 'string' || subject.trim().length < 3) {
      return NextResponse.json({ error: 'Invalid subject' }, { status: 400 })
    }
    if (typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: typeof phone === 'string' ? phone.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
    })

    return NextResponse.json(
      { success: true, contactId: contact._id },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to submit contact form', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}


