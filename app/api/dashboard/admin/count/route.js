import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.Model";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import UserModel from "@/models/UserModel";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }
    await connectDB();

    const [category, product, customer, order] = await Promise.all([
      CategoryModel.countDocuments({ deletedAt: null }),
      ProductModel.countDocuments({ deletedAt: null }),
      UserModel.countDocuments({ deletedAt: null, role: 'user' }),
      OrderModel.countDocuments({ deletedAt: null}),
    ])

    return response(true, 200, 'Dashboard Count.', {
      category, product, customer, order
    });
  } catch (error) {
    return catchError(error);
  }
}

