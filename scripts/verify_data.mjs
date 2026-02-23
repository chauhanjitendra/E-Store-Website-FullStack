
import { connectDB } from "../lib/databaseConnection.js";
import ProductModel from "../models/Product.model.js";
import ProductVariantModel from "../models/ProductVariant.model.js";
import mongoose from "mongoose";

async function verify() {
    try {
        await connectDB();
        console.log("Connected to DB:", mongoose.connection.name);

        const variantCount = await ProductVariantModel.countDocuments();
        console.log("Total Product Variants:", variantCount);

        if (variantCount > 0) {
            const variant = await ProductVariantModel.findOne().lean();
            console.log("Example Variant's product ID:", variant.product);

            const product = await ProductModel.findById(variant.product).lean();
            if (product) {
                console.log("MATCH FOUND! Variant points to existing Product:", product.name);
            } else {
                console.log("DATA ORPHAN! Variant points to NON-EXISTENT Product ID:", variant.product);

                // Check if any product exists at all
                const oneProduct = await ProductModel.findOne().lean();
                if (oneProduct) {
                    console.log("One actual Product ID in DB:", oneProduct._id);
                }
            }
        }

        // Check if there are ANY matches
        const allVariants = await ProductVariantModel.find().lean();
        let matches = 0;
        const productIds = new Set((await ProductModel.find({}, '_id').lean()).map(p => p._id.toString()));

        for (const v of allVariants) {
            if (productIds.has(v.product.toString())) {
                matches++;
            }
        }
        console.log(`Total variants with valid product links: ${matches} out of ${variantCount}`);

    } catch (err) {
        console.error("Verification failed:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

verify();
