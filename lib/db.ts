import mongoose from 'mongoose';

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (process.env.NODE_ENV === 'development') {
        // In dev, prevent hot-reload connections from piling up
        if (cached.conn) {
            return cached.conn;
        }
    }

    if (!process.env.MONGO_URI) {
        throw new Error('Please define the MONGO_URI environment variable');
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable buffering to fail fast if not connected
            serverSelectionTimeoutMS: 5000, // Fail after 5s if no server found
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log('✅ MongoDB Connected Successfully');
            return mongoose;
        }).catch(err => {
            console.error('❌ MongoDB Connection Error:', err);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
