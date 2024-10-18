const express = require('express');
const router = express.Router();
const { downloadFileHandler } = require('../controllers/bandwidthController');
const { isAuthenticated } = require('../middleware/authMiddleware.js');

// Download route (protected)
router.get('/download', downloadFileHandler); // Add isAuthenticated later

module.exports = router;