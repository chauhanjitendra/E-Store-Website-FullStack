
import { connectDB } from "../lib/databaseConnection.js";
import ProductModel from "../models/Product.model.js";
import mongoose from "mongoose";

async function listProducts() {
    try {
        await connectDB();
        const count = await ProductModel.countDocuments();
        console.log(`Total Products: ${count}`);

        const products = await ProductModel.find().limit(10).select('name slug').lean();
        console.log("Slugs in DB:", products.map(p => p.slug));

        // Check if the user's slug exists even partially
        const partial = await ProductModel.find({ slug: /depulso/i }).lean();
        console.log(`Products matching 'depulso': ${partial.length}`);
        if (partial.length > 0) {
            console.log("Full slug:", partial[0].slug);
        }

    } catch (err) {
        console.error("List failed:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

listProducts();
