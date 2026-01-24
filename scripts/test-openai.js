require('dotenv').config();
const OpenAI = require("openai");

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error("❌ No API Key found in .env");
    process.exit(1);
}

console.log("🔑 Testing Key:", apiKey.substring(0, 15) + "...");

const openai = new OpenAI({ apiKey });

async function test() {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Say hello" }],
        });
        console.log("✅ Success!");
        console.log("Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("❌ Error:", error.message);
        if (error.response) {
            console.error("Data:", error.response.data);
        }
    }
}

test();
