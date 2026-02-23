import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import CouponModel from "@/models/Coupon.Model";
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
                { code: { $regex: globalFilter, $options: 'i' } },

                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: '$minShoppingAmount' },
                            regex: globalFilter,
                            options: 'i'
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: '$discountPercentage' },
                            regex: globalFilter,
                            options: 'i'
                        }
                    }
                }
            ]
        }

        // column filteration
        filters.forEach(filter => {
            if (filter.id === 'minShoppingAmount' || filter.id === 'discountPercentage') {
                matchQuery[filter.id] = Number(filter.value)
            } else if (filter.id === 'validity') {
                matchQuery[filter.id] = new Date(filter.value)
            }
            else {
                matchQuery[filter.id] = { $regex: filter.value, options: 'i' }
            }
        });

        // sorting
        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        });

        // Aggregate pipeline
        const aggregatePipeline = [

            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    code: 1,
                    discountPercentage: { $ifNull: ["$discountPercentage", "$discountPercentages", 0] },
                    minShoppingAmount: 1,
                    validity: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1,
                }
            }
        ]
        // excute query
        const getCoupon = await CouponModel.aggregate(aggregatePipeline)

        // get totalRowCount
        const totalRowCount = await CouponModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getCoupon,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }
}
