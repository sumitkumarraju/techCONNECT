import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Atlas connected");
    } catch (error: any) {
        console.error("❌ MongoDB connection failed", error.message);
        // process.exit(1); // Don't crash the server, just log error
    }
};

export default connectDB;
