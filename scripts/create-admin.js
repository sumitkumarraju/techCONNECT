
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

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

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB.");

        const adminEmail = "admin@techconnect.com";
        const adminUsername = "admin";
        const adminPassword = "adminpassword123";

        const existingUser = await User.findOne({ $or: [{ email: adminEmail }, { username: adminUsername }] });

        if (existingUser) {
            console.log("Admin user already exists.");
            // Optional: Reset password if needed
            // const salt = await bcrypt.genSalt(10);
            // existingUser.passwordHash = await bcrypt.hash(adminPassword, salt);
            // await existingUser.save();
            // console.log("Admin password reset.");
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(adminPassword, salt);

        const newAdmin = await User.create({
            name: "Admin User",
            username: adminUsername,
            email: adminEmail,
            passwordHash,
            role: 'admin',
            bio: 'System Administrator',
            skills: ['Administrator']
        });

        console.log("Admin user created successfully.");
        console.log("Email:", adminEmail);
        console.log("Password:", adminPassword);

    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

createAdmin();
