import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { connectDB } from "@/lib/databaseConnection";
import { response, catchError } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import MediaModel from "@/models/Media.Model";

function getRandomItems(array, count = 1) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function POST(req) {
    await connectDB();
    try {
        const products = await ProductModel.find({ deletedAt: null });
        if (products.length === 0) {
            return response(false, 400, "No products found to create variants for!");
        }

        const mediaList = await MediaModel.find();
        const mediaIds = mediaList.map(media => media._id);

        const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow"];
        const sizes = ["S", "M", "L", "XL", "XXL"];

        let variants = [];

        for (const product of products) {
            // Create 3-5 variants for each product
            const variantCount = faker.number.int({ min: 3, max: 5 });
            const selectedColors = getRandomItems(colors, variantCount);

            for (let i = 0; i < selectedColors.length; i++) {
                const color = selectedColors[i];
                const size = faker.helpers.arrayElement(sizes);

                const mrp = Number(product.mrp);
                const sellingPrice = product.sellingPrice;
                const discountPercentages = product.discountPercentage || 0;

                variants.push({
                    _id: new mongoose.Types.ObjectId(),
                    product: product._id,
                    color: color,
                    size: size,
                    mrp: mrp.toString(),
                    sellingPrice: sellingPrice,
                    discountPercentages: discountPercentages,
                    sku: `${product.slug}-${color}-${size}-${faker.number.int({ min: 1000, max: 9999 })}`,
                    media: getRandomItems(mediaIds, 1),
                    deletedAt: null,
                });
            }
        }

        // Use insertMany for efficiency
        if (variants.length > 0) {
            await ProductVariantModel.insertMany(variants);
        }

        return response(true, 200, `${variants.length} fake variants generated successfully.`);

    } catch (error) {
        return catchError(error);
    }
}   