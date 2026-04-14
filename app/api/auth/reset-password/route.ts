import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await dbConnect();
    }

    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const hash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
