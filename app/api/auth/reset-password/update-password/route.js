import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import userModel from "@/models/UserModel";

export async function PUT(request){
    try {
        await connectDB()
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            email: true, password:true
        })       
 
        const validatedData = validationSchema.safeParse(payload)

        if(!validatedData.success){
            return response(false, 401, "Invalid or Missing Flied.", validatedData.error);
        }

        const {email, password} = validatedData.data

        const getUser =await userModel.findOne({deletedAt: null, email}).select("+password")

        if(!getUser){
            return response(false, 404, "User Note Found.",);
        }

        getUser.password =password
        await getUser.save()

        return response(true, 200, "Password Update Success!.");

    } catch (error) {
       return catchError(error)
    }
}