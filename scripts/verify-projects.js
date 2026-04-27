const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
// Re-use usage of random user or create new one?
// Better create new one to be clean.
const RANDOM_ID = Math.floor(Math.random() * 10000);
const TEST_USER = {
    name: 'Project Tester',
    username: `projtester_${RANDOM_ID}`,
    email: `projtester_${RANDOM_ID}@example.com`,
    password: 'password123'
};

async function runTest() {
    console.log('🚀 Starting Projects Verification...');

    let token = '';
    let userId = '';

    // 1. Register/Login
    try {
        console.log('1. Registering user...');
        const res = await axios.post(`${API_URL}/auth/register`, TEST_USER);
        token = res.data.token;
        userId = res.data._id;
        console.log('✅ User registered');
    } catch (err) {
        console.log('❌ Auth failed', err.message);
        process.exit(1);
    }

    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    // 2. Create Project
    const PROJ_NAME = `Test Project ${RANDOM_ID}`;
    try {
        console.log('2. Creating project...');
        const res = await axios.post(`${API_URL}/projects`, {
            name: PROJ_NAME,
            description: "Test Description"
        }, authHeaders);

        if (res.status === 201 && res.data.name === PROJ_NAME) {
            console.log('✅ Project created:', res.data._id);
        } else {
            console.log('❌ Project creation failed', res.data);
        }
    } catch (err) {
        console.log('❌ Project creation error', err.response ? err.response.data : err.message);
    }

    // 3. List Projects (GET /projects/my)
    try {
        console.log('3. Listing projects (GET /projects/my)...');
        const res = await axios.get(`${API_URL}/projects/my`, authHeaders);

        const found = res.data.find(p => p.name === PROJ_NAME);
        if (found) {
            console.log('✅ Project found in list');
        } else {
            console.log('❌ Project NOT found in list. Response length:', res.data.length);
            console.log('   Response data:', JSON.stringify(res.data, null, 2));
        }
    } catch (err) {
        console.log('❌ List projects error', err.message);
    }

    console.log('🎉 Verification Complete');
}

runTest();
