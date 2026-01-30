const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const CHALLENGES = [
    {
        title: "AI Chatbot Interface",
        difficulty: "medium",
        description: "Build a responsive chat interface with streaming responses and typing indicators.",
        points: 500,
        starterCode: "// Write your solution here\n\nfunction solution(input) {\n    // Implement chatbot logic\n    return \"Response\";\n}",
        testCases: [
            { input: "\"Hello\"", output: "\"Response\"" }
        ],
        tags: ["React", "UI/UX", "Streaming"]
    },
    {
        title: "DeFi Crypto Wallet dashboard",
        difficulty: "hard",
        description: "Create a Web3 wallet dashboard showing real-time token balances and gas fees.",
        points: 1000,
        starterCode: "// Write your solution here\n\nfunction getBalance(address) {\n    return 0;\n}",
        testCases: [],
        tags: ["Web3", "Blockchain", "Dashboard"]
    },
    {
        title: "Real-time Collaboration Board",
        difficulty: "hard",
        description: "Implement a whiteboard where multiple users can draw and move shapes in real-time.",
        points: 800,
        starterCode: "// Socket.io setup\n\nfunction onDraw(data) {\n    // Broadcast data\n}",
        testCases: [],
        tags: ["Socket.io", "Canvas", "Real-time"]
    },
    {
        title: "Responsive Landing Page",
        difficulty: "easy",
        description: "Design a high-converting landing page with smooth animations and mobile layout.",
        points: 300,
        starterCode: "/* CSS here */\n\n.hero {\n    display: flex;\n}",
        testCases: [],
        tags: ["CSS Grid", "Animations", "Responsive"]
    }
];

// User Schema (simplified matching required fields)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true }, // Added required field
    role: { type: String, default: 'user' },
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Challenge Schema (matching requirement)
const ChallengeSchema = new mongoose.Schema({
    title: String,
    description: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    points: Number,
    starterCode: String,
    testCases: Array,
    tags: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);

async function seed() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ No MONGO_URI found in environment");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to DB");

        // Find a user to assign as creator
        let user = await User.findOne({ role: 'admin' });
        if (!user) {
            user = await User.findOne({});
        }

        if (!user) {
            console.log("⚠️ No users found in DB. Creating a temporary admin user...");
             user = await User.create({
                name: "Admin User",
                username: "admin",
                email: "admin@techconnect.com",
                passwordHash: "$2a$10$abcdefg", // Dummy hash
                role: 'admin'
            });
        }

        console.log(`Using user: ${user.username} (${user._id}) as creator.`);

        console.log("Cleaning old challenges...");
        await Challenge.deleteMany({});

        console.log("Seeding new challenges...");
        const challengesWithUser = CHALLENGES.map(c => ({
            ...c,
            createdBy: user._id
        }));

        const docs = await Challenge.insertMany(challengesWithUser);
        console.log(`✅ Seeded ${docs.length} challenges`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed", error);
        process.exit(1);
    }
}

seed();
