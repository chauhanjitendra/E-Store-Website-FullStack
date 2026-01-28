import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.Model";
import { isValidObjectId } from "mongoose";

export async function GET(request, {params}){
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
        const getCategory = await CategoryModel.findOne(filter).lean()

        if(!getCategory){
            return response(false, 404, 'Category Note Found')
        }

        return response(true, 200, 'Category Found.', getCategory)
    } catch (error) {
        return catchError(error)
    }
}