import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("❌ MONGO_URI is missing from process.env");
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Atlas connected");
    } catch (error: any) {
        console.error("❌ MongoDB connection failed:", error.message);
        // Do NOT exit process in Next.js/Vercel
    }
};

export default connectDB;
