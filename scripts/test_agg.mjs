
import { connectDB } from "../lib/databaseConnection.js";
import ProductModel from "../models/Product.model.js";
import ProductVariantModel from "../models/ProductVariant.model.js";
import mongoose from "mongoose";

async function testQueries() {
    try {
        await connectDB();
        const product = await ProductModel.findOne().lean();
        if (!product) {
            console.log("No products found.");
            return;
        }
        console.log("Testing with Product ID:", product._id);

        // Test 1: findOne
        const findOneResult = await ProductVariantModel.findOne({ product: product._id }).lean();
        console.log("findOne result:", findOneResult ? "Found" : "Not Found");

        // Test 2: distinct
        const distinctResult = await ProductVariantModel.distinct("color", { product: product._id });
        console.log("distinct colors count:", distinctResult.length);

        // Test 3: aggregate (size query)
        const getSize = await ProductVariantModel.aggregate([
            { $match: { product: product._id } },
            { $group: { _id: "$size" } }
        ]);
        console.log("aggregate sizes count:", getSize.length);

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testQueries();
