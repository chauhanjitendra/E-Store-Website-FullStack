import { NextResponse } from "next/server";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/databaseConnection";
import { zSchema } from "@/lib/zodSchema";
import { SignJWT } from "jose";
import UserModel from "@/models/UserModel";
import { sendMail } from "@/lib/sendMail";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    // ✅ Validation schema
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing input fields",
          errors: validatedData.error,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validatedData.data;

    // ✅ Check user already exists
    const checkUser = await UserModel.exists({ email });

    if (checkUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already registered",
        },
        { status: 409 }
      );
    }

    // ✅ Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const newUser = new UserModel({
      name,
      email,
      password,
    });

    await newUser.save();

    // ✅ JWT token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newUser._id.toString()})
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    // ✅ Send email
    await sendMail(
      "Email Verification request from Developer Jitendra",
      email,
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
      )
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful. Please verify your email address.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
