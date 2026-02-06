const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' }); // Load env vars (or .env)

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

// Simple Schema definition to avoid importing the TS model which might fail here
const ChallengeSchema = new mongoose.Schema({
    title: String,
    description: String,
    difficulty: String,
    points: Number,
    starterCode: String,
    testCases: Array,
    tags: [String],
    createdBy: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);

async function seed() {
    // Need mongo uri, check process.env or hardcode for local if .env fails to load
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("❌ No MONGO_URI found in environment");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to DB");

        // Find or create a user to be the creator
        let user = await mongoose.connection.collection('users').findOne({});
        let userId;

        if (!user) {
            console.log("Creating placeholder user...");
            const result = await mongoose.connection.collection('users').insertOne({
                name: "Seed User",
                email: "seed@example.com",
                username: "seeduser",
                password: "hashedpassword",
                createdAt: new Date(),
                updatedAt: new Date()
            });
            userId = result.insertedId;
        } else {
            userId = user._id;
        }

        console.log("Cleaning old challenges...");
        await Challenge.deleteMany({});

        console.log("Seeding new challenges...");
        const challengesWithUser = CHALLENGES.map(c => ({ ...c, createdBy: userId }));
        const docs = await Challenge.insertMany(challengesWithUser);
        console.log(`✅ Seeded ${docs.length} challenges`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed", error);
        process.exit(1);
    }
}

seed();
