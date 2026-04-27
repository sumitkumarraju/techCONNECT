const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
// Use random user
const RANDOM_ID = Math.floor(Math.random() * 10000);
const TEST_USER = {
    name: 'Profile Tester',
    username: `proftester_${RANDOM_ID}`,
    email: `proftester_${RANDOM_ID}@example.com`,
    password: 'password123'
};

async function runTest() {
    console.log('🚀 Starting Profile Verification...');

    let token = '';

    // 1. Register
    try {
        console.log('1. Registering user...');
        const res = await axios.post(`${API_URL}/auth/register`, TEST_USER);
        token = res.data.token;
        console.log('✅ User registered');
    } catch (err) {
        console.log('❌ Auth failed', err.message);
        process.exit(1);
    }

    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 2. Update Profile
    const UPDATE_DATA = {
        bio: "Updated Bio for Test",
        skills: ["Node.js", "Testing"],
        githubUrl: "https://github.com/test",
        linkedinUrl: "https://linkedin.com/in/test"
    };

    try {
        console.log('2. Updating profile...');
        const res = await axios.put(`${API_URL}/profile`, UPDATE_DATA, authHeaders);

        if (res.status === 200 && res.data.bio === UPDATE_DATA.bio) {
            console.log('✅ Profile updated:', res.data.bio);
        } else {
            console.log('❌ Update failed', res.data);
        }
    } catch (err) {
        console.log('❌ Update error', err.response ? err.response.data : err.message);
    }

    // 3. Verify Persistence (GET /auth/me)
    try {
        console.log('3. Verifying profile via /auth/me...');
        const res = await axios.get(`${API_URL}/auth/me`, authHeaders);

        if (res.data.bio === UPDATE_DATA.bio && res.data.githubUrl === UPDATE_DATA.githubUrl) {
            console.log('✅ Profile Verified Persistent');
        } else {
            console.log('❌ Persistence failed', res.data);
        }
    } catch (err) {
        console.log('❌ Verification error', err.message);
    }

    console.log('🎉 Verification Complete');
}

runTest();
