const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getAdminCredentials } = require('../services/adminService');
const router = express.Router();
const cors = require('cors');

// Your secret key for signing tokens
const JWT_SECRET = '6f7c4a95e45f7a0e9bdb5d6b487cfe1f3c3bcd5f1f8d8eab173e8fbdccae1f85';

// Specify your client origin here


const CLIENT_ORIGIN = 'http://localhost:3000';

router.use(cors({
    origin: CLIENT_ORIGIN, // Allow your frontend origin
    credentials: true // Allow credentials
}));

// Handle login form submission (POST /login)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await getAdminCredentials(username);
        const isPasswordCorrect = await bcrypt.compare(password, admin.password_hash);

        if (isPasswordCorrect) {
            // Generate a JWT token
            const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: '1h' });

            // Return the token in the response
            return res.json({ token }); // Send token as JSON response
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Error during login');
    }
});

// Middleware to verify JWT token
const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer scheme

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Save decoded token data in req.user
        next();
    } catch (err) {
        return res.status(400).send('Invalid token.');
    }
};

// Admin dashboard route (GET /admin), protected by the `isAuthenticated` middleware
router.get('/admin', isAuthenticated, (req, res) => {
    res.send(`Welcome, ${req.user.username}!`); // Use username from decoded token
});

module.exports = router;
