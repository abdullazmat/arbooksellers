import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";

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

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // For security, don't reveal if user exists or not
      return NextResponse.json({ 
        message: "If an account exists with this email, you will receive a reset link shortly." 
      }, { status: 200 });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${resetToken}`;

    const { getPasswordResetEmail } = await import("@/lib/email-templates");

    try {
      console.log(`Attempting to send password reset email to ${user.email}...`);
      await transporter.sendMail({
        from: `"AR Book Sellers" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Password Reset Request - AR Book Sellers",
        html: getPasswordResetEmail(user.name, resetUrl)
      });
      console.log(`Password reset email sent successfully to ${user.email}`);
    } catch (emailError: any) {
      console.error("Forgot password email failed:", emailError.message);
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "If an account exists with this email, you will receive a reset link shortly." 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
