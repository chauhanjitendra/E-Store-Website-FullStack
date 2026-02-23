import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.Model";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId"); // match frontend
    if (!productId) {
      return response(false, 404, "Product Id Missing..");
    }

    const review = await ReviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          deletedAt: null,
        },
      },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // total review
    const totalReview = review.reduce((sum, r) => sum + r.count, 0);

    // average rating
    const averageRating =
      totalReview > 0
        ? (
            review.reduce((sum, r) => sum + r._id * r.count, 0) / totalReview
          ).toFixed(1)
        : "0.0";

    // rating count
    const rating = review.reduce((acc, r) => {
      acc[r._id] = r.count;
      return acc;
    }, {});

    // percentage
    const percentage = review.reduce((acc, r) => {
      acc[r._id] =
        totalReview > 0 ? ((r.count / totalReview) * 100).toFixed(2) : 0;
      return acc;
    }, {});

    return response(true, 200, "Review Details", {
      totalReview,
      averageRating,
      rating,
      percentage,
    });
  } catch (error) {
    return catchError(error);
  }
}
