const express = require('express');
const { createClientHandler, checkAllTablesHandler, logBandwidthUsageHandler, getBandwidthUsageHandler, downloadFileHandler } = require('../controllers/bandwidthController');

const router = express.Router();

// Define your routes
router.post('/clients', createClientHandler);
router.get('/tables', checkAllTablesHandler);
router.post('/log-bandwidth', logBandwidthUsageHandler);
router.get('/bandwidth-usage/:client_id', getBandwidthUsageHandler);
router.get('/download', downloadFileHandler);

module.exports = router; // Ensure you are exporting the router
