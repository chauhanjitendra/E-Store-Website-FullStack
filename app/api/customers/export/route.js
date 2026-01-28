import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import userModel from "@/models/UserModel";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthirized')
        }

        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getcustomers = await userModel.find(filter).sort({ createdAt: -1 }).lean()

        if (!getcustomers) {
            return response(false, 404, 'Collection Empty.')
        }
        return response(true, 200, 'Data Found', getcustomers)
    } catch (error) {
        return catchError(error)
    }
}