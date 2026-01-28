import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isValidObjectId } from "mongoose";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.Model";

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
        const getProduct = await ProductModel.findOne(filter).populate('media','_id secure_url').lean()

        if(!getProduct){
            return response(false, 404, 'Product Not Found')
        }

        return response(true, 200, 'Product Found.', getProduct)
    } catch (error) {
        return catchError(error)
    }
}