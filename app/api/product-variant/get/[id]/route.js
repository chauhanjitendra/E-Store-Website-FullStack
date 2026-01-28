import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isValidObjectId } from "mongoose";
import ProductVariantModel from "@/models/ProductVariant.model";
import Media from "@models/Media.model";

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
        const getVariant = await ProductVariantModel.findOne(filter).populate('product','name').populate('media','_id secure_url').lean()

        if(!getVariant){
            return response(false, 404, 'Product Variant Not Found')
        }

        return response(true, 200, 'Product Variant Found.', getVariant)
    } catch (error) {
        return catchError(error)
    }
}