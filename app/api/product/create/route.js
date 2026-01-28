import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    const Schema = zSchema.pick({
      name: true,
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentages: true,
      description: true,
      media: true
    });

    const validate = Schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or Missing fields.", validate.error);
    }

    const productData = validate.data;

    // ✅ newCategory define kiya
    const newProduct = new ProductModel({
      name: productData.name,
      slug: productData.slug,
      category: productData.category,
      mrp: productData.mrp,
      sellingPrice: productData.sellingPrice,
      discountPercentages: productData.discountPercentages,
      description:encode(productData.description),
      media: productData.media,
    });

    await newProduct.save();

    return response(true, 200, "Product Updated Successfully.");
  } catch (error) {
    return catchError(error);
  }
}
