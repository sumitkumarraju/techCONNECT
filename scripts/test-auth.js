
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

if (!MONGO_URI) {
    console.error("MONGO_URI is missing");
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function testAuth() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected.");

        const testUser = {
            name: "Test User",
            username: "testuser_" + Date.now(),
            email: "test_" + Date.now() + "@example.com",
            password: "password123"
        };

        console.log("Registering user:", testUser.username);

        // 1. Check if user exists (should not)
        const exists = await User.findOne({ email: testUser.email });
        if (exists) {
            console.error("User already exists (unexpected)");
            return;
        }

        // 2. Create User
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(testUser.password, salt);
        const user = await User.create({
            name: testUser.name,
            username: testUser.username,
            email: testUser.email,
            passwordHash
        });
        console.log("User created:", user._id);

        // 3. Login
        console.log("Attempting login...");
        const foundUser = await User.findOne({ email: testUser.email });
        if (!foundUser) {
            console.error("Login failed: User not found");
            return;
        }

        const isMatch = await bcrypt.compare(testUser.password, foundUser.passwordHash);
        if (!isMatch) {
            console.error("Login failed: Password mismatch");
            return;
        }

        const token = jwt.sign({ id: foundUser._id }, JWT_SECRET, { expiresIn: "1d" });
        console.log("Login successful. Token generated:", token.substring(0, 20) + "...");

        // 4. Verify Token
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.id === foundUser._id.toString()) {
            console.log("Token verified successfully.");
        } else {
            console.error("Token verification failed ID mismatch.");
        }

        // Cleanup
        await User.deleteOne({ _id: user._id });
        console.log("Test user deleted.");

    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

testAuth();
