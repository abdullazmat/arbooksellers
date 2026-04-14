import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { Contact } from "@/models/Contact";
import nodemailer from "nodemailer";
import { APP_CONFIG } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await dbConnect();
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Request too large", details: "Max request size is 2MB." },
        { status: 413 },
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { name, email, phone, subject, message } = body || {};

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          error: "Missing fields",
          details: "name, email, subject, and message are required",
        },
        { status: 400 },
      );
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (typeof subject !== "string" || subject.trim().length < 3) {
      return NextResponse.json({ error: "Invalid subject" }, { status: 400 });
    }
    if (typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: typeof phone === "string" ? phone.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
      status: "new",
    });

    // Send email to AR Book Sellers
    try {
      await transporter.sendMail({
        from: `"AR Book Sellers Contact" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `New Contact Form: ${subject.trim()}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name.trim()}</p>
          <p><strong>Email:</strong> <a href="mailto:${email.trim()}">${email.trim()}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone.trim()}</p>` : ""}
          <p><strong>Subject:</strong> ${subject.trim()}</p>
          <br />
          <h3>Message:</h3>
          <p>${message.trim().replace(/\n/g, "<br>")}</p>
        `,
      });
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError.message);
      // Don't fail the entire request if email fails
    }

    // Send confirmation email to user
    const userDomain = email.trim().split('@')[1];
    const shouldSendConfirmation = !APP_CONFIG.test.skipConfirmationForDomains.includes(userDomain);

    if (shouldSendConfirmation) {
      try {
        await transporter.sendMail({
          from: `"AR Book Sellers Support" <${process.env.SMTP_USER}>`,
          to: email.trim(),
          subject: "We Received Your Message - AR Book Sellers",
          html: `
            <h2>Thank you for contacting us!</h2>
            <p>Hi ${name.trim()},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <br />
            <h3>Your Message Details:</h3>
            <p><strong>Subject:</strong> ${subject.trim()}</p>
            <p><strong>Message:</strong></p>
            <p>${message.trim().replace(/\n/g, "<br>")}</p>
            <br />
            <p>Best regards,<br>AR Book Sellers Team</p>
          `,
        });
      } catch (emailError: any) {
        console.error("Confirmation email sending failed:", emailError.message);
      }
    } else {
      console.log(`Skipping confirmation email for test domain: ${userDomain}`);
    }

    return NextResponse.json(
      { success: true, contactId: contact._id },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to submit contact form",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
