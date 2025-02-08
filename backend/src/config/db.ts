import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(ENV.MONGO_URI as string);
        console.log(`✅ Connected to MongoDB in ${ENV.NODE_ENV} mode`);
    } catch (error) {  
        console.error('❌ MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

export const disconnectDB = async (): Promise<void> => {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
};

export const checkDBConnection = async (): Promise<boolean> => {
    try {
        return mongoose.connection.readyState === 1;
    } catch (error) {
        console.error("Error checking MongoDB connection: ", error);
        return false;
    }
};