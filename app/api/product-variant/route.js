import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";
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

    if(deleteType === 'SD'){
        matchQuery = {deletedAt: null}
    }else if(deleteType === 'PD'){
        matchQuery = {deletedAt: {$ne : null}}
    }

    // Global search
    if(globalFilter){
        matchQuery['$or'] = [
            {name: {$regex: globalFilter,$options: 'i'}},
            {slug: {$regex: globalFilter,$options: 'i'}},
            {'productData.name': {$regex: globalFilter,$options: 'i'}},
            {
                $expr:{
                    $regexMatch:{
                        input: {$toString: '$mrp'},
                        regex: globalFilter,
                        options: 'i'
                    }
                }
            },
            {
                $expr:{
                    $regexMatch:{
                        input: {$toString: '$sellingPrice'},
                        regex: globalFilter,
                        options: 'i'
                    }
                }
            },
            {
                $expr:{
                    $regexMatch:{
                        input: {$toString: '$discountPercentages'},
                        regex: globalFilter,
                        options: 'i'
                    }
                }
            }
        ]
    }

    // column filteration
    filters.forEach(filter =>{
        if(filter.id === 'mrp' || filter.id === 'sellingPrice' || filter.id === 'discountPercentages'){
            matchQuery[filter.id] = Number(filter.value)
        } else if(filter.id === 'product'){
             matchQuery['productData.name'] = {$regex: filter.value,$options: 'i'}
        }
        else{
            matchQuery[filter.id] = {$regex: filter.value,options: 'i'}
        }
    });

    // sorting
    let sortQuery = {}
    sorting.forEach(sort => {
        sortQuery[sort.id] = sort.desc ? -1 : 1
    });

    // Aggregate pipeline
    const aggregatePipeline = [
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productData'
            }
        },
        {
            $unwind:{
                path: '$productData', preserveNullAndEmptyArrays: true
            }
        },
        {$match: matchQuery},
        {$sort: Object.keys(sortQuery).length ? sortQuery : {createdAt: -1}},
        {$skip: start},
        {$limit: size},
        {
            $project:{
                _id:1,
                product: "$productData.name",
                color: 1,
                size: 1,
                sku: 1,
                mrp: 1,
                sellingPrice: 1,
                discountPercentages: 1,
                createdAt: 1,
                updatedAt: 1,
                deletedAt: 1,
            }
        }
    ]
    // excute query
    const getProductVariant = await ProductVariantModel.aggregate(aggregatePipeline)

    // get totalRowCount
    const totalRowCount = await ProductVariantModel.countDocuments(matchQuery)
    
    return NextResponse.json({
        success: true,
        data: getProductVariant,
        meta: {totalRowCount}
    })

  } catch (error) {
    return catchError(error)
  }
}
