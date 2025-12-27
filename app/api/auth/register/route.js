import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/databaseConnection";
import { zSchema } from "@/lib/zodSchema";
import { SignJWT } from "jose";
import  UserModel  from "@/models/UserModel";

export async function POST(request){
    try {
        await connectDB()

        //validationschema
        const validationSchema =zSchema.pick({
            name:true,
            email:true,
            password:true,
        })
        const payload =await request.json()

        const validatedData = validationSchema.safeParse(payload)

        if(!validatedData.success){
            return Response(false,401,'Invalid or Missing input fields,',
                validatedData.error)
        }
        const {name,email,password}= validatedData.data;

        //check user already registered
        const checkUser =await UserModel.exists({email})
        if(checkUser){
             return Response(true,409,'User already Registered,',)
        }

        // new registration
        const newRegistration = new UserModel({
            name,email,password
        })
        
        await newRegistration.save()
        const secret =new TextEncoder().encode(process.env.SECRET_KEY)
        const token =await new SignJWT({ userId: newRegistration._id})
        .setIssuedAt()
        .setExpirationTime('1h')
        .setProtectedHeader({alg:'HS256'})
        .sign(secret)

        await sendMail('Email Verification request from Developer Jitendra',email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`))

        return reponse(true,200,'Registration Successful, Please verify your email to address.')

    } catch (error) {
        catchError(error)
    }
}