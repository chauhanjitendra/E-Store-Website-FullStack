import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.Model";
import { isValidObjectId } from "mongoose";

export async function GET(request,{params}){
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, 'Unauthirized')
        }

        await connectDB()

        const geParams = await params
        const {id} = await params

        const filter ={
            deletedAt: null
        }
        if(!isValidObjectId(id)){
            return response(false, 400, 'Invalid Object Id.')
        }
        filter._id = id
        const getMedia = await MediaModel.findOne(filter).lean()

        if(!getMedia){
            return response(false, 404, 'Media Note Found')
        }

        return response(true, 200, 'Media Found.', getMedia)
    } catch (error) {
        return catchError(error)
    }
}