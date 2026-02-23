import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.Model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ReviewModel from "@/models/Review.Model";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const getParams = await params;
    const slug = getParams.slug;

    const searchParams = request.nextUrl.searchParams;
    const size = searchParams.get("size");
    const color = searchParams.get("color");

    const filter = {
      deletedAt: null,
    };

    if (!slug) {
      return response(false, 404, "Product Not Found.");
    }

    filter.slug = slug;

    // get product
    const getProduct = await ProductModel.findOne(filter)
      .populate("media", "secure_url")
      .lean();

    if (!getProduct) {
      return response(false, 404, "Product Not Found.");
    }

    // get product variant
    const variantFilter = {
      product: getProduct._id,
    };

    if (size) {
      variantFilter.size = size;
    }

    if (color) {
      variantFilter.color = color;
    }

    let variant = await ProductVariantModel.findOne(variantFilter)
      .populate("media", "secure_url")
      .lean();

    if (!variant) {
      return response(false, 404, "Product Not Found.");
    }

    // if (!variant) {
    //   variant = await ProductVariantModel.findOne({
    //     product: getProduct._id,
    //   });
    // }

    // get color and size
    const getColor = await ProductVariantModel.distinct("color", {
      product: getProduct._id,
    });

    const getSize = await ProductVariantModel.aggregate([
      { $match: { product: getProduct._id } },
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: "$size",
          first: { $first: "$_id" },
        },
      },
      { $sort: { first: 1 } },
      { $project: { _id: 0, size: "$_id" } },
    ]);

    // get review
    const reviews = await ReviewModel.find({ product: getProduct._id }).lean();
    const reviewCount = reviews.length;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviews.forEach(r => {
      ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
      totalRating += r.rating;
    });

    const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0.0";

    const productData = {
      product: getProduct,
      variant: variant,
      colors: getColor,
      sizes: getSize.length ? getSize.map((item) => item.size) : [],
      reviewCount: reviewCount,
      ratingDistribution,
      averageRating,
    };

    return response(true, 200, "Product data Found.", productData);
  } catch (error) {
    return catchError(error);
  }
}
