import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import MediaModel from "@/models/Media.Model";


export async function GET(request, { params }) {
    try {
        await connectDB()
        const getParmas = await params
        const orderid = getParmas.orderid

        if (!orderid) {
            return response(false, 404, 'Order Not Found..')
        }

        const orderData = await OrderModel.findOne({ order_id: orderid }).populate('products.productId', 'name slug').populate({
            path: 'products.variantId',
            populate: { path: 'media' }
        }).lean()

        if (!orderData) {
            return response(false, 404, 'Order Not Found..')
        }

        return response(true, 200, 'Order Found..', orderData)
    } catch (error) {
        return catchError(error)
    }
}
