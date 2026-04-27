const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
const RANDOM_ID = Math.floor(Math.random() * 10000);
const TEST_USER = {
    name: 'Test Agent',
    username: `testagent_${RANDOM_ID}`,
    email: `testagent_${RANDOM_ID}@example.com`,
    password: 'password123'
};

async function runTest() {
    console.log('🚀 Starting Auth Verification...');
    console.log('Target:', API_URL);
    console.log('Test User:', TEST_USER.username);

    // 1. Initial Check (Should fail)
    try {
        console.log('\n1. Checking /auth/me (expecting 401)...');
        await axios.get(`${API_URL}/auth/me`);
        console.log('❌ Failed: /auth/me should have returned 401');
    } catch (err) {
        if (err.response && err.response.status === 401) {
            console.log('✅ Passed: 401 received');
        } else {
            console.log('❌ Failed: Unexpected error', err.message);
        }
    }

    let token = '';

    // 2. Register
    try {
        console.log('\n2. Registering user...');
        const res = await axios.post(`${API_URL}/auth/register`, TEST_USER);
        if (res.status === 201 && res.data.token) {
            token = res.data.token;
            console.log('✅ Passed: User registered, token received');
        } else {
            console.log('❌ Failed: Invalid response', res.status, res.data);
            process.exit(1);
        }
    } catch (err) {
        console.log('❌ Failed: Registration error', err.response ? err.response.data : err.message);
        process.exit(1);
    }

    // 3. Verify Token
    try {
        console.log('\n3. Verifying token at /auth/me...');
        const res = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 200 && res.data.username === TEST_USER.username) {
            console.log('✅ Passed: Token verified, user profile received');
        } else {
            console.log('❌ Failed: Invalid profile', res.data);
        }
    } catch (err) {
        console.log('❌ Failed: Token verification error', err.message);
    }

    // 4. Login
    try {
        console.log('\n4. Logging in...');
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        if (res.status === 200 && res.data.token) {
            console.log('✅ Passed: Login successful');
            // Check if token is different? Usually yes.
        } else {
            console.log('❌ Failed: Login response', res.status);
        }
    } catch (err) {
        console.log('❌ Failed: Login error', err.response ? err.response.data : err.message);
    }

    console.log('\n🎉 Auth Verification Complete!');
}

runTest();
