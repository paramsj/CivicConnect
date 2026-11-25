import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async() => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("❌ MONGODB_URI is not set in environment variables! Please provide your MongoDB connection URL in .env");
            process.exit(1);
        }

        if (mongoose.connection.readyState === 0) {
            const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
                dbName: DB_NAME 
            });
            console.log("✅ Connected to MongoDB successfully!");
        } else {
            console.log("MongoDB already connected");
        }           
    } catch (error) {
        console.error("❌ Error connecting to the database:", error.message);
        process.exit(1); 
    }
}
export default connectDB;