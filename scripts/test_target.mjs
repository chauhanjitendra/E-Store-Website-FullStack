
import { connectDB } from "../lib/databaseConnection.js";
import ProductModel from "../models/Product.model.js";
import ProductVariantModel from "../models/ProductVariant.model.js";
import mongoose from "mongoose";

async function testTarget() {
    try {
        await connectDB();
        const slug = "depulso-decipio-territo";
        const product = await ProductModel.findOne({ slug }).lean();

        if (!product) {
            console.log(`Product with slug ${slug} not found.`);
            return;
        }
        console.log("Found Product:", product._id);

        const variants = await ProductVariantModel.find({ product: product._id }).lean();
        console.log(`Variants found for this product: ${variants.length}`);

        if (variants.length === 0) {
            console.log("Searching for ALL variants to see if any point to this product...");
            const allVariants = await ProductVariantModel.find().lean();
            const matching = allVariants.filter(v => v.product.toString() === product._id.toString());
            console.log(`Matching variants by manual string compare: ${matching.length}`);

            if (allVariants.length > 0) {
                console.log("Example variant product ID (raw):", allVariants[0].product);
                console.log("Example variant product field type:", typeof allVariants[0].product);
            }
        }

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testTarget();
