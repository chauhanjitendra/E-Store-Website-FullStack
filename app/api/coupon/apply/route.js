import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.Model";

export async function POST(request){
    try {
        await connectDB()
        const payload = await request.json()
        const couponFromSchema = zSchema.pick({
            code: true,
            minShoppingAmount: true
        })

        const validate = couponFromSchema.safeParse(payload)
        if(!validate.success){
            return response(false, 400, 'Missing or Invaild Data.', validate.error)
        }
        const {code, minShoppingAmount} = validate.data

        const couponData = await CouponModel.findOne({code}).lean()

        if(!couponData){
            return response(false, 400, 'Invalid or Expired Coupon Code.')
        }

        if(new Date() > couponData.validity){
            return response(false, 400, 'Coupon Code Expired.')
        }

        if(minShoppingAmount < couponData.minShoppingAmount){
            return response(false, 400, 'In-Sufficient Shopping Amount.')
        }

        return response(true, 200, 'Coupon Applied SuccessFully.', {discountPercentage: couponData.discountPercentage})
    } catch (error) {
        return catchError(error)
    }
}