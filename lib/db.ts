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

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

/**
 * Pauses execution for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified delay.
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Connects to the MongoDB database using Mongoose.
 *
 * In development, it reuses the connection to prevent connection pooling issues
 * during Next.js hot module replacement (HMR). Includes a retry mechanism
 * for robustness in production.
 *
 * @param retryCount - The current number of connection attempts (used internally for recursion).
 * @returns A promise that resolves to the Mongoose instance once connected.
 * @throws Will throw an error if the connection fails after the maximum number of retries,
 *         or if the MONGO_URI environment variable is not defined.
 */
const connectDB = async (retryCount = 0): Promise<typeof mongoose> => {
    // In dev, prevent hot-reload connections from piling up
    if (process.env.NODE_ENV === 'development' && cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGO_URI) {
        throw new Error(
            '❌ MONGO_URI is not defined. Please set it in your .env file.\n' +
            'Example (Atlas): MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/techconnect?retryWrites=true&w=majority'
        );
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log('✅ MongoDB Connected Successfully to:', process.env.MONGO_URI?.replace(/\/\/.*@/, '//***@'));
            return mongoose;
        }).catch(async (err) => {
            console.error(`❌ MongoDB Connection Error (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err.message);
            cached.promise = null;

            if (retryCount < MAX_RETRIES - 1) {
                console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);
                await sleep(RETRY_DELAY_MS);
                return connectDB(retryCount + 1);
            }

            throw new Error(
                `Failed to connect to MongoDB after ${MAX_RETRIES} attempts. ` +
                `Make sure your MongoDB server or Atlas cluster is reachable. Error: ${err.message}`
            );
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
