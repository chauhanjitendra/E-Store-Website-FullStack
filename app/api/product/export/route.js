import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthirized')
        }

        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getProduct = await ProductModel.find(filter).sort({ createdAt: -1 })

        if (!getProduct) {
            return response(false, 404, 'Collection Empty.')
        }
        return response(true, 200, 'Data Found', getProduct)
    } catch (error) {
        return catchError(error)
    }
}