import { connectDB } from "./lib/databaseConnection.js";
import OrderModel from "./models/Order.model.js";
import mongoose from "mongoose";

async function findOrder() {
    try {
        await connectDB();
        const order = await OrderModel.findOne().lean();
        if (order) {
            console.log("Found Order ID:", order.order_id);
            console.log("Full Order Data:", JSON.stringify(order, null, 2));
        } else {
            console.log("No orders found in database.");
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.connection.close();
    }
}

findOrder();
