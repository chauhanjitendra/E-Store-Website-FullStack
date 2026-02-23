
import Link from 'next/link'
import React from 'react'
import { IoMdArrowForward } from "react-icons/io";
import { connectDB } from '@/lib/databaseConnection';
import ProductModel from '@/models/Product.model';
import MediaModel from '@/models/Media.Model';
import ProductBox from './ProductBox';

const FeatureProducts = async () => {

    await connectDB();
    const getProduct = await ProductModel.find({ deletedAt: null }).populate('media', '_id secure_url').limit(8).lean()
    const productData = { success: true, data: getProduct };

    if(!productData) return null
    return (
        <>
            <section className='lg:px-32 px-4 sm:py-10'>
                <div className='flex justify-between items-center mb-5'>
                    <h2 className='sm:text-4xl text-2xl font-semibold'>Featured Products</h2>
                    <Link href='' className='flex items-center underline underline-offset-4 hover:text-primary '>
                        View All
                        <IoMdArrowForward />
                    </Link>
                </div>
                <div className='grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2'>
                    {!productData.success && <div className='text-center py-5'>Data Not Found...</div>}

                    {productData.success && productData.data.map((product)=>(
                        <ProductBox key={product._id} product={product}/>
                    ))}
                </div>
            </section>
        </>
    )
}

export default FeatureProducts