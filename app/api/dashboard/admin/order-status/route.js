import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/Order.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }
        await connectDB();

        const statusCounts = await OrderModel.aggregate([
            {
                $match: {
                    deletedAt: null
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {count: 1}
            }
        ]);

        return response(true, 200, 'Order Status Counts Found', statusCounts);

    } catch (error) {
        return catchError(error);
    }
}
