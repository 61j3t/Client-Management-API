const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { getAdminCredentials } = require('../services/adminService');
const { isAuthenticated } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management operations
 */

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Display the login form
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Login form
 *   post:
 *     summary: Authenticate admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "c1jet"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       302:
 *         description: Redirects to admin dashboard on success
 *       401:
 *         description: Invalid credentials
 */
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
    console.log('Request Body:', req.body);
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
        console.error('Error during login:', err);
        res.send(err);
    }
});

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Admin dashboard (protected)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for admin
 *       401:
 *         description: Unauthorized access
 */
router.get('/admin', isAuthenticated, (req, res) => {
    res.send('Welcome, Admin!');
});

module.exports = router;
