import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.Model";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const matchQuery = {
      deletedAt: null,
      product: new mongoose.Types.ObjectId(productId),
    };

    // aggregation
    const aggregation = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
      },
      {
        $match: matchQuery,
      },
      { $sort: { createdAt: 1 } },
      { $skip: skip },
      { $limit: limit + 1 },
      {
        $project: {
          _id: 1,
          ReviewedBy: "$userData.name",
          avatar: "$userData.avatar",
          rating: 1,
          title: 1,
          review: 1,
          createdAt: 1,
        },
      },
    ];

    const review = await ReviewModel.aggregate(aggregation);

    const totalReview = await ReviewModel.countDocuments(matchQuery)

    // check if more data exits
    let nextPage = null;
    if (review.length > limit) {
      nextPage = page + 1;
      review.pop();
    }

    return response(true, 200, "Review Data.", { review, nextPage, totalReview });
  } catch (error) {
    return catchError(error);
  }
}
