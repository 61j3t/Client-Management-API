const express = require('express');
const router = express.Router();
const { downloadFileHandler } = require('../controllers/bandwidthController');
const { isAuthenticated } = require('../middleware/authMiddleware.js');

/**
 * @swagger
 * tags:
 *   name: Download
 *   description: File download operations
 */

/**
 * @swagger
 * /download:
 *   get:
 *     summary: Download a file (protected)
 *     tags: [Download]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: client_id
 *         required: true
 *         description: The ID of the client requesting the download
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: File download successful
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
router.get('/download', isAuthenticated, downloadFileHandler);

module.exports = router;
