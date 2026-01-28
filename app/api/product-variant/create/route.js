import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    const schema = zSchema.pick({
      product: true,
      sku: true,
      color: true,
      size: true,
      mrp: true,
      sellingPrice: true,
      discountPercentages: true,
      media: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or Missing fields.", validate.error);
    }

    const variantData = validate.data;

    // ✅ newCategory define kiya
    const newProductVariant = new ProductVariantModel({
      product: variantData.product,
      sku: variantData.sku,
      color: variantData.color,
      size: variantData.size,
      mrp: variantData.mrp,
      sellingPrice: variantData.sellingPrice,
      discountPercentages: variantData.discountPercentages,
      media: variantData.media,
    });

    await newProductVariant.save();

    return response(true, 200, "Product Variant Added Successfully.");
  } catch (error) {
    return catchError(error);
  }
}
