import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { APP_CONFIG } from "@/lib/config";
import bcrypt from "bcryptjs";

import { getOTPEmail } from "@/lib/email-templates";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) console.warn("WARNING: JWT_SECRET is not defined in environment variables");

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const { name, email, password, phone, resendOnly } = await request.json();

    // resendOnly logic
    if (resendOnly) {
      if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
      
      const pending = await PendingUser.findOne({ email: email.toLowerCase() });
      if (!pending) {
        const verifiedUser = await User.findOne({ email: email.toLowerCase() });
        if (verifiedUser) {
          return NextResponse.json({ error: "Account already verified. Please sign in." }, { status: 400 });
        }
        return NextResponse.json({ error: "No pending registration found. Please sign up again." }, { status: 404 });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      pending.verificationOTP = otp;
      pending.verificationOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
      await pending.save();

      const userDomain = email.trim().split('@')[1];
      const shouldSendEmail = !APP_CONFIG.test.skipConfirmationForDomains.includes(userDomain);

      if (shouldSendEmail) {
        console.log(`Attempting to resend OTP to ${pending.email}...`);
        try {
          await transporter.sendMail({
            from: `"AR Book Sellers" <${process.env.SMTP_USER}>`,
            to: pending.email,
            subject: `${otp} is your new AR Book Sellers verification code`,
            html: getOTPEmail(pending.name, otp)
          });
          console.log(`Resent OTP successfully to ${pending.email}`);
        } catch (emailError: any) {
          console.error("Resend OTP failed:", emailError.message);
        }
      }
      return NextResponse.json({ message: "Verification OTP resent" });
    }

    // Main Signup logic
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Delete any existing pending registration for this email
    await PendingUser.deleteOne({ email: email.toLowerCase() });

    // Hash password for storage in PendingUser
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed.");

    if (APP_CONFIG.auth.requireEmailVerification) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const pending = new PendingUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        verificationOTP: otp,
        verificationOTPExpires: new Date(Date.now() + 15 * 60 * 1000),
      });

      await pending.save();

      const userDomain = email.trim().split('@')[1];
      const shouldSendEmail = !APP_CONFIG.test.skipConfirmationForDomains.includes(userDomain);

      if (shouldSendEmail) {
        console.log(`Attempting to send verification email to ${pending.email}...`);
        try {
          await transporter.sendMail({
            from: `"AR Book Sellers" <${process.env.SMTP_USER}>`,
            to: pending.email,
            subject: `${otp} is your AR Book Sellers verification code`,
            html: getOTPEmail(pending.name, otp)
          });
          console.log(`Verification email sent successfully to ${pending.email}`);
        } catch (emailError: any) {
          console.error("Verification email failed:", emailError.message);
        }
      }

      return NextResponse.json({
        message: "Verification OTP sent to your email",
        requiresVerification: true,
        email: pending.email,
      });
    } else {
      // Direct signup if verification is disabled
      const user = new User({
        name,
        email: email.toLowerCase(),
        password: password, // user model will hash it
        phone,
        isVerified: true,
      });

      await user.save();

      // Return user data and token (omitted for brevity, same as before)
      const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      
      return NextResponse.json({
        message: "User registered successfully",
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      });
    }
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

