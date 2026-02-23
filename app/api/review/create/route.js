import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ReviewModel from "@/models/Review.Model";

export async function POST(request) {
  try {

    // only user hi review de sakata hai

    // const auth = await isAuthenticated("user");
    // if (!auth.isAuth) {
    //   return response(false, 403, "Unauthorized.");
    // }

    // 🔥 Authentication OPTIONAL
    const auth = await isAuthenticated(); // role check hata diya

    await connectDB();

    const payload = await request.json();

    const Schema = zSchema.pick({
      productId: true,
      userId: true,
      rating: true,
      title: true,
      review: true,
    });

    const validate = Schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or Missing fields.", validate.error);
    }

    const { productId, userId, rating, title, review } = validate.data;

    const newReview = new ReviewModel({
      product: productId,
      user: auth.user._id,
      rating: rating,
      title: title,
      review: review,
    })

    await newReview.save();

    return response(true, 200, "Your Review Submitted Successfully.");
  } catch (error) {
    return catchError(error);
  }
}
