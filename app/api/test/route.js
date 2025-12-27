import { connectDb } from "@/lib/databaseConnection";
import { NextResponse } from "next/server";

export async function GET(){
    await connectDb()
    return NextResponse.json({
        success: true,
        message: "Database Connected Successfully"
    })
}