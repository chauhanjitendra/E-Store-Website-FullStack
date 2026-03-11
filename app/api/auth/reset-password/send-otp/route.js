import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import userModel from "@/models/UserModel";

export async function POST(request){
    try {
        await connectDB()
        const payload = await request.json()
        const validationSchema =zSchema.pick({
            email: true
        })
        const validatedData =validationSchema.safeParse(payload)
        if(!validatedData.success){
            return response (false,401,'Invalid Or Missing Input Filed.',validatedData.error)
        }

        const {email} = validatedData.data
        const getUser = await userModel.findOne({deletedAt: null, email}).lean()
        
        if(!getUser){
            return response (false,404,'User Note Found.')
        }
     // remove old otps
        await OTPModel.deleteMany({email})
        const otp = generateOTP()
        const newOtpData = new OTPModel({
            email,otp
        })

        await newOtpData.save()

        const html = await otpEmail(otp);
        const otpSendStatus = await sendMail('Your Login Verification Code.',email, html)
        if(!otpSendStatus.success){
            return response(false, 400 ,'Failed To Resend OTP.')
        }
        return response(true, 200 ,'Please Verify Your Account...')



    } catch (error) {
      return catchError(error)
    }
}