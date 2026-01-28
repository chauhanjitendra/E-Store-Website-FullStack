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

    const loggedInUserData = {
      id: getUser._id,
      role: getUser.role,
      name: getUser.name,
      _avatar: getUser._avatar,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const cookiesStore = await cookies();

    cookiesStore.set({
      name: "access_token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // remove otp after validation
    await getOtpData.deleteOne();

    return response(true, 200, "Login successful.", {
      _id: getUser._id,
      name: getUser.name,
      role: getUser.role,
    });
  } catch (error) {
    return catchError(error);
  }
}
