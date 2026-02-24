import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.Model";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.Model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }
        await connectDB();

        const latestReview = await ReviewModel.find({ deletedAt: null }).sort({ createdAt: -1 }).populate({
            path: 'product',
            select: 'name media',
            populate: {
                path: 'media',
                select: 'secure_url'
            }
        })

        return response(true, 200, 'Latest Reviews', latestReview);
    } catch (error) {
        return catchError(error);
    }
}
