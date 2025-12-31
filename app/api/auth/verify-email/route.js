import { connectDB } from "@/lib/databaseConnection";
import UserModel from "@/models/UserModel";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    await connectDB();

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token missing" },
        { status: 400 }
      );
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user id" },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.isEmailVerified = true;
    await user.save(); // ✅ now pre-save works

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}
