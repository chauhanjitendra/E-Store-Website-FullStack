import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.Model";
import ProductModel from "@/models/Product.model";
import userModel from "@/models/UserModel";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }

        await connectDB()

        const searchParams = request.nextUrl.searchParams

        // extract query parameters
        const start = parseInt(searchParams.get('start') || 0, 10)
        const size = parseInt(searchParams.get('size') || 10, 10)
        const filters = JSON.parse(searchParams.get('filters') || '[]')
        const globalFilter = searchParams.get('globalFilters') || ''
        const sorting = JSON.parse(searchParams.get('sorting') || '[]')
        const deleteType = searchParams.get('deleteType')

        // Build match query
        let matchQuery = {}

        if (deleteType === 'SD') {
            matchQuery = { deletedAt: null }
        } else if (deleteType === 'PD') {
            matchQuery = { deletedAt: { $ne: null } }
        }

        // Global search
        if (globalFilter) {
            matchQuery['$or'] = [
                { "productData.name": { $regex: globalFilter, $options: 'i' } },
                { "userData.name": { $regex: globalFilter, $options: 'i' } },
                { rating: { $regex: globalFilter, $options: 'i' } },
                { title: { $regex: globalFilter, $options: 'i' } },
                { review: { $regex: globalFilter, $options: 'i' } },
            ]
        }

        // column filteration
        filters.forEach(filter => {
            if (filter.id === 'product') {
                matchQuery['productData.name'] = { $regex: filter.value, $options: 'i' }
            } else if (filter.id === 'userName' || filter.id === 'user') {
                matchQuery['userData.name'] = { $regex: filter.value, $options: 'i' }
            } else {
                matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            }
        });

        // sorting
        let sortQuery = {}
        sorting.forEach(sort => {
            if (sort.id === 'userName') {
                sortQuery['userData.name'] = sort.desc ? -1 : 1
            } else {
                sortQuery[sort.id] = sort.desc ? -1 : 1
            }
        });

        // Base Pipeline for Lookups
        const basePipeline = [
            {
                $lookup: {
                    from: 'products',
                    let: { productId: '$product' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toString: '$_id' }, { $toString: '$$productId' }]
                                }
                            }
                        }
                    ],
                    as: 'productData'
                }
            },
            {
                $unwind: { path: '$productData', preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userId: '$user' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toString: '$_id' }, { $toString: '$$userId' }]
                                }
                            }
                        }
                    ],
                    as: 'userData'
                }
            },
            {
                $unwind: { path: '$userData', preserveNullAndEmptyArrays: true }
            }
        ];

        // Aggregate pipeline
        const aggregatePipeline = [
            ...basePipeline,
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    product: { $ifNull: ['$productData.name', 'N/A'] },
                    userName: { $ifNull: ['$userData.name', 'Unknown User'] },
                    rating: 1,
                    title: 1,
                    review: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,
                }
            }
        ]

        // execute query
        const getReview = await ReviewModel.aggregate(aggregatePipeline)

        // get totalRowCount (using aggregation to account for lookup filters)
        const countPipeline = [
            ...basePipeline,
            { $match: matchQuery },
            { $count: "total" }
        ];
        const countResult = await ReviewModel.aggregate(countPipeline);
        const totalRowCount = countResult.length > 0 ? countResult[0].total : 0;

        return NextResponse.json({
            success: true,
            data: getReview,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }
}
