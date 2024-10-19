const jwt = require('jsonwebtoken');

// Your secret key for verifying tokens
const JWT_SECRET = '6f7c4a95e45f7a0e9bdb5d6b487cfe1f3c3bcd5f1f8d8eab173e8fbdccae1f85';

function isAuthenticated(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer scheme

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user data to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).send('Invalid token.');
    }
}

module.exports = { isAuthenticated };
