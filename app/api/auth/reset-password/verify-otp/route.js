import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import userModel from "@/models/UserModel";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = zSchema.pick({
      otp: true,
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or Missing input Filed.",
        validatedData.error
      );
    }

    const { email, otp } = validatedData.data;

    const getOtpData = await OTPModel.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 404, "Invalid or Exprired OTP.");
    }

    const getUser = await userModel
      .findOne({ deletedAt: null, email })
      .select("_id name role")
      .lean();
    if (!getUser) {
      return response(false, 404, "User Not Found.");
    }

    // remove otp after validation
    await getOtpData.deleteOne();

    return response(true, 200, "OTP Verified...", {
      _id: getUser._id,
      name: getUser.name,
      role: getUser.role,
    });
  } catch (error) {
    return catchError(error);
  }
}
