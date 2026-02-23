import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isPublic = searchParams.get("public") === "true";

    if (!isPublic) {
      const auth = await isAuthenticated("admin");
      if (!auth.isAuth) {
        return response(false, 403, "Unauthorized.");
      }
    }

    await connectDB();

    // extract query parameters
    const start = parseInt(searchParams.get("start") || 0, 10);
    const size = parseInt(searchParams.get("size") || 10, 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilters") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    // Build match query
    let matchQuery = {};

    if (deleteType === "SD") {
      matchQuery = { deletedAt: null };
    } else if (deleteType === "PD") {
      matchQuery = { deletedAt: { $ne: null } };
    }

    // Global search
    if (globalFilter) {
      matchQuery["$or"] = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
        { "categoryData.name": { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$mrp" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$sellingPrice" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercentage" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
      ];
    }

    // column filteration
    filters.forEach((filter) => {
      if (
        filter.id === "mrp" ||
        filter.id === "sellingPrice" ||
        filter.id === "discountPercentages"
      ) {
        matchQuery[filter.id] = Number(filter.value);
      } else {
        matchQuery[filter.id] = { $regex: filter.value, options: "i" };
      }
    });

    // sorting
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    // Aggregate pipeline
    const aggregatePipeline = [
      {
        $lookup: {
          from: "category",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: {
            $cond: [
              { $ne: [{ $ifNull: ["$discountPercentage", null] }, null] },
              "$discountPercentage",
              {
                $cond: [
                  { $gt: [{ $toDouble: { $ifNull: ["$mrp", "0"] } }, 0] },
                  {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              {
                                $subtract: [
                                  { $toDouble: { $ifNull: ["$mrp", "0"] } },
                                  {
                                    $toDouble: {
                                      $ifNull: ["$sellingPrice", "0"],
                                    },
                                  },
                                ],
                              },
                              { $toDouble: { $ifNull: ["$mrp", "1"] } },
                            ],
                          },
                          100,
                        ],
                      },
                      0,
                    ],
                  },
                  0,
                ],
              },
            ],
          },
          category: "$categoryData.name",
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];
    // excute query
    const getProduct = await ProductModel.aggregate(aggregatePipeline);

    // get totalRowCount
    const totalRowCount = await ProductModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getProduct,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
