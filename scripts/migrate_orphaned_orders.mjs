import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    order_id: String
});

const UserSchema = new mongoose.Schema({
    email: String
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema, 'orders');
const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

async function migrateOrders() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        // Find orders where user is missing or null
        const orphanedOrders = await Order.find({
            $or: [
                { user: { $exists: false } },
                { user: null }
            ]
        });

        console.log(`Found ${orphanedOrders.length} orphaned orders.`);

        let linkedCount = 0;
        for (const order of orphanedOrders) {
            // Find the user with this email
            const user = await User.findOne({ email: order.email });
            if (user) {
                order.user = user._id;
                await order.save();
                console.log(`Linked order ${order.order_id} to user ${order.email}`);
                linkedCount++;
            } else {
                console.log(`No user found for email ${order.email} (Order: ${order.order_id})`);
            }
        }

        console.log(`Successfully linked ${linkedCount} orders.`);
        await mongoose.disconnect();
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateOrders();
