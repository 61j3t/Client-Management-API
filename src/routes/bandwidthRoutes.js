const express = require('express');
const router = express.Router();
const { getBandwidthRecords } = require('../services/bandwidthService');
const { isAuthenticated } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Bandwidth
 *   description: Bandwidth management operations
 */

/**
 * @swagger
 * /bandwidth:
 *   get:
 *     summary: Retrieve bandwidth records
 *     tags: [Bandwidth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: client_id
 *         required: false
 *         description: The ID of the client to filter records
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: start_date
 *         required: false
 *         description: Start date for filtering records (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           example: "2023-01-01"
 *       - in: query
 *         name: end_date
 *         required: false
 *         description: End date for filtering records (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           example: "2023-12-31"
 *       - in: query
 *         name: status
 *         required: false
 *         description: Status of the bandwidth usage (e.g., active, inactive)
 *         schema:
 *           type: string
 *           example: "active"
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of records to return
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: offset
 *         required: false
 *         description: Number of records to skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: A list of bandwidth records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   client_id:
 *                     type: integer
 *                   requested_bandwidth:
 *                     type: number
 *                     format: float
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   ip_address:
 *                     type: string
 *                   session_id:
 *                     type: string
 *                   status:
 *                     type: string
 *       500:
 *         description: Error fetching bandwidth records
 */
router.get('/bandwidth', isAuthenticated, async (req, res) => {
    const { client_id, start_date, end_date, status, limit = 100, offset = 0 } = req.query;

    try {
        const bandwidthRecords = await getBandwidthRecords(
            client_id ? parseInt(client_id) : null,
            start_date ? new Date(start_date) : null,
            end_date ? new Date(end_date) : null,
            status || null,
            parseInt(limit),
            parseInt(offset)
        );
        res.json(bandwidthRecords);
    } catch (err) {
        res.status(500).send('Error fetching bandwidth records');
    }
});

module.exports = router;
