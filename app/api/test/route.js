import { connectDB } from "@/lib/databaseConnection";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";

export async function GET(){
    await connectDB()
    return NextResponse.json({
        success: true,
        message: "Database Connected Successfully"
    })
}

export async function POST(request) {
    try {
        await connectDB();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Verify the email
        user.isEmailVerified = true;
        await user.save();

        return NextResponse.json(
            { success: true, message: `Email verified for ${email}` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Test API Error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}