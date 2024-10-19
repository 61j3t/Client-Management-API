const express = require('express');
const router = express.Router();
const { getAllBandwidthRecords } = require('../services/bandwidthService');
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
 *     summary: Retrieve all bandwidth records
 *     tags: [Bandwidth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all bandwidth records
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
 *                   allocated_bandwidth:
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
router.get('/bandwidth', async (req, res) => {
    try {
        const bandwidthRecords = await getAllBandwidthRecords();
        res.json(bandwidthRecords);
    } catch (err) {
        res.status(500).send('Error fetching bandwidth records');
    }
});

module.exports = router;
