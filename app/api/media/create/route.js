import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import mediaModel from "@/models/Media.Model";

export async function POST(request){
    const payload = await request.json()
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false,403, 'Unauthorized')
        }
        await connectDB()
        const newMedia = await mediaModel.insertMany(payload)
        return response (true, 200, 'Media Uploaded Successfully..', newMedia)

    } catch (error) {
        if(payload && payload.length > 0){
            const publicIds = payload.map(data=>data.public_id)
            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (deleteError) {
                error.cloudinary = deleteError
            }
        }
        catchError(error)
    }
}