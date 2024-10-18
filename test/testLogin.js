const axios = require('axios');

async function testAdminLogin() {
    // Function to simulate login request
    async function login(username, password) {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password
            }, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            console.log('Login Successful:', response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('Invalid Credentials');
            } else {
                console.error('Error:', error.response ? error.response.data : error.message);
            }
        }
    }

    // Test with valid credentials
    await login('c1jet', 'c1jet123');

    // Test with invalid credentials
    await login('c1jet', 'wrongpassword');
}

testAdminLogin();