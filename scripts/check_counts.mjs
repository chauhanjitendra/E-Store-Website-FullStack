
import { connectDB } from "../lib/databaseConnection.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkCounts() {
    try {
        await connectDB();
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log("Collection Document Counts:");
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            const sample = await db.collection(col.name).findOne();
            console.log(`${col.name}: ${count}`);
            if (sample) {
                console.log(`  Sample: ${JSON.stringify(sample).substring(0, 100)}...`);
            }
        }

    } catch (err) {
        console.error("Check failed:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

checkCounts();
