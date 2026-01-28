import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.Model"; // ✅ IMPORTANT

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    const Schema = zSchema.pick({
      _id: true,
      name: true,
      slug: true,
    });

    const validate = Schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or Missing fields.", validate.error);
    }

    const {_id, name, slug } = validate.data;

    const getCategory = await CategoryModel.findOne({ deletedAt: null. _id})
    if(!getCategory){
      return response(false, 404, "Data Note Found.");
    }
    getCategory.name = name
    getCategory.slug = slug
    await getCategory.save()

    return response(true, 200, "Category Updated Successfully.");
  } catch (error) {
    return catchError(error);
  }
}
