const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { getAdminCredentials } = require('../services/adminService');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Login route
router.get('/login', (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    `);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await getAdminCredentials(username);
        const isPasswordCorrect = await bcrypt.compare(password, admin.password_hash);

        if (isPasswordCorrect) {
            req.session.isAuthenticated = true;
            return res.redirect('/admin');
        } else {
            res.send('Invalid credentials');
        }
    } catch (err) {
        res.send('Invalid credentials');
    }
});

// Admin dashboard route (protected)
router.get('/admin', isAuthenticated, (req, res) => {
    res.send('Welcome, Admin!');
});

module.exports = router;