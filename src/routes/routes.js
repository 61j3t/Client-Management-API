// src/routes/routes.js

const express = require('express');
const { createClient, logBandwidthUsage, getBandwidthUsage, downloadFile } = require('../controllers/bandwidth');

const router = express.Router();

// Test database connection
router.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Database connection error', err);
        res.status(500).json({ error: 'Database connection error' });
    }
});

// Client creation route
router.post('/clients', createClient);

// API route to log bandwidth usage
router.post('/bandwidth-usage', logBandwidthUsage);

// API route to get bandwidth usage for a client
router.get('/bandwidth-usage/:client_id', getBandwidthUsage);

// File download route
router.get('/download', downloadFile);

module.exports = router;