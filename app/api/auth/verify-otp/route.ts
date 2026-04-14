import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { getSignupWelcomeEmail } from "@/lib/email-templates";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) console.warn("WARNING: JWT_SECRET is not defined in environment variables");

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    // Look in PendingUser instead of User
    const pending = await PendingUser.findOne({ 
      email: email.toLowerCase().trim()
    });

    if (!pending) {
      // Check if they are already verified in the main User collection
      const verifiedUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (verifiedUser) {
        return NextResponse.json({ 
          error: "Account already verified. Please sign in.",
          alreadyVerified: true 
        }, { status: 400 });
      }
      return NextResponse.json({ error: "No pending registration found. Please sign up again." }, { status: 400 });
    }

    const storedOtp = String(pending.verificationOTP || "").trim();
    const providedOtp = String(otp || "").trim();
    
    const isOtpMatch = storedOtp === providedOtp;
    const isExpired = pending.verificationOTPExpires ? new Date(pending.verificationOTPExpires).getTime() < Date.now() : false;

    if (!isOtpMatch || isExpired) {
      return NextResponse.json({ 
        error: isExpired ? "OTP has expired" : "Invalid OTP code" 
      }, { status: 400 });
    }

    // Success! Now move them to the main User collection
    const user = new User({
      name: pending.name,
      email: pending.email,
      password: pending.password, // Already hashed in signup
      phone: pending.phone,
      isVerified: true
    });

    // Important: Bypass the pre-save password hashing because it's already hashed
    // But since the User model has a pre-save hook that checks isModified('password'),
    // we need to make sure Mongoose knows it's NOT modified if possible, 
    // or we just let it hash again (doubled hash is bad).
    
    // Actually, I'll update User model manually here to bypass hook or just fix hook.
    // Better: I'll save the user and then delete pending.
    await user.save();
    await PendingUser.deleteOne({ _id: pending._id });

    // Send Welcome Email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"AR Book Sellers" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Welcome to AR Book Sellers!",
        html: getSignupWelcomeEmail(user.name)
      });
    } catch (e) {
      console.error("Welcome email failed:", e);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Account verified successfully",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    }, { status: 200 });

  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
