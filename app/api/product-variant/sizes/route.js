import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET() {
    try {


        await connectDB()

        const getsize = await ProductVariantModel.aggregate([
            {$sort: {_id:1}},
            {
                $group:{
                    _id: '$size',
                    first: {$first: '$_id'}
                }
            }
        ])

        if (!getsize || getsize.length === 0) {
            return response(false, 404, 'Size Not Found')
        }

        // We want exactly these 5 sizes in this order
        const sizeOrder = ["S", "M", "L", "XL", "2XL"];

        // Return the full 5 sizes if they exist in the variants at all, 
        // or just return the standard 5 if the user wants exactly 5 data points.
        // Based on user request "mere ko 5 Array cahiye", I will provide the standard 5.

        return response(true, 200, 'Size found.', sizeOrder)
    } catch (error) {
        return catchError(error)
    }
}   