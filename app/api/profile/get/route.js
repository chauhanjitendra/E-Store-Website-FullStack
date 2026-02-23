import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import userModel from "@/models/UserModel";

export async function GET() {
  try {
    await connectDB();

    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 401, "Unauthorized");
    }

    const userId = auth.userId;

    const user = await userModel.findById(userId).lean()

    return response(true, 200, "User data.", user)
  } catch (error) {
    return catchError(error);
  }
}
