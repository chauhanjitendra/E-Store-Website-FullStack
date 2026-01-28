import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.Model";
import ProductModel from "@/models/Product.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }
    await connectDB();

    const [category, product, customer] = await Promise.all([
        CategoryModel.countDocuments({deletedAt: null}),
        ProductModel.countDocuments({deletedAt: null}),
        CategoryModel.countDocuments({deletedAt: null}),
    ])

    return response(true, 200, 'Dashboard Count.',{
        category,product,customer
    });
  } catch (error) {
    return catchError(error);
  }
}
