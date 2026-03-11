import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response, generateOTP } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import userModel from "@/models/UserModel";
import { SignJWT } from "jose";
import {z} from "zod";

export async function POST(request) {
    try {
       await connectDB()
       const payload = await request.json()

       const ValidationSchema = zSchema.pick({
            email: true
       }).extend({
            password: z.string()
       })

       const validatedData = ValidationSchema.safeParse(payload)
       if(!validatedData.success){
        return response (false, 401, 'Invalid or Missing input Field', validatedData.error)
       }

       const {email, password} = validatedData.data

    //    get user data
       const getUser = await userModel.findOne({deletedAt: null, email}).select("+password")
      //  console.log(getUser);
       
       if(!getUser){
            return response(false,400, 'Invalid Login Credentials.')
       }

    //    resend email verification link
       if(!getUser.isEmailVerified){
         const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const token = await new SignJWT({ userId: getUser._id.toString()})
              .setIssuedAt()
              .setExpirationTime("1h")
              .setProtectedHeader({ alg: "HS256" })
              .sign(secret);
        
            // ✅ Send email
            try {
              const html = await emailVerificationLink(
                `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
              );
              await sendMail(
                "Email Verification request from Developer Jitendra",
                email,
                html
              );
            } catch (mailError) {
              console.error("Mail sending error:", mailError);
              // Continue even if mail fails - user can verify later
            }
            
            return response(false, 401, 'Your email is not verified. We have sent a verification link to your registered email address. Please check your email and click the verification link to activate your account.')
       }

    //    password verification 
       const isPsswordVeriFied = await getUser.comparePassword(password)

       if(!isPsswordVeriFied){
            return response(false,400, 'Invalid Login Credentials.')
       }

    // otp generation
    await OTPModel.deleteMany({email})  //deleting old otps

    const otp = generateOTP()

    // storing otp into database
    const newOtpData = new OTPModel({
        email,otp
    })

    await newOtpData.save()
    
    const html = await otpEmail(otp);
    const otpEmailStatus = await sendMail('Your Login Verification Code', email, html)
    if(!otpEmailStatus.success){
        return response(false,400, 'Failed To Send OTP.')
    }

    return response(true, 200, 'Please Verify Your Devices.')

    } catch (error) {
        return catchError(error)
    }
}