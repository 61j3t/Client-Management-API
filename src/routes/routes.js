const express = require('express');
const router = express.Router();
const { downloadFileHandler } = require('../controllers/bandwidthController');
const adminConfig = require('../config/adminConfig');

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
}

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

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminConfig.username && password === adminConfig.password) {
        req.session.isAuthenticated = true;
        return res.redirect('/admin');
    }
    res.send('Invalid credentials');
});

// Admin route (protected)
router.get('/admin', isAuthenticated, (req, res) => {
    res.send('Welcome, Admin!');
});

// Download route
router.get('/download', downloadFileHandler);

module.exports = router;