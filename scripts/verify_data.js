
import { connectDB } from "./lib/databaseConnection.js";
import ProductModel from "./models/Product.model.js";
import ProductVariantModel from "./models/ProductVariant.model.js";

async function verify() {
    await connectDB();
    console.log("Connected to DB");

    const productCount = await ProductModel.countDocuments();
    console.log("Total Products:", productCount);

    const variantCount = await ProductVariantModel.countDocuments();
    console.log("Total Product Variants:", variantCount);

    if (productCount > 0) {
        const product = await ProductModel.findOne().lean();
        console.log("Example Product ID:", product._id);

        const variants = await ProductVariantModel.find({ product: product._id }).lean();
        console.log(`Variants for Product ${product._id}:`, variants.length);

        if (variants.length === 0) {
            console.log("Checking for variants with string ID mismatch...");
            const allVariants = await ProductVariantModel.find().limit(5).lean();
            if (allVariants.length > 0) {
                console.log("Example Variant Product field:", allVariants[0].product);
                console.log("Type of Variant Product field:", typeof allVariants[0].product);
            }
        }
    }

    process.exit(0);
}

verify().catch(err => {
    console.error(err);
    process.exit(1);
});
