const express = require('express');
const router = express.Router();
const { pauseClient, resumeClient, banClient, adjustBandwidthLimit } = require('../services/controlService');
const { isAuthenticated } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Control
 *   description: User control operations
 */

/**
 * @swagger
 * /control/pause:
 *   post:
 *     summary: Pause a client's connection
 *     tags: [Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: client_id
 *         required: true
 *         description: The ID of the client to pause
 *         schema:
 *           type: object
 *           properties:
 *             client_id:
 *               type: integer
 *     responses:
 *       200:
 *         description: Client connection paused successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Error pausing client connection
 */
router.post('/pause', async (req, res) => {
    const { client_id } = req.body;
    console.log(req.body)
    try {
        await pauseClient(client_id);
        res.status(200).send('Client connection paused successfully');
    } catch (err) {
        res.status(500).send('Error pausing client connection');
    }
});

/**
 * @swagger
 * /control/resume:
 *   post:
 *     summary: Resume a client's connection
 *     tags: [Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: client_id
 *         required: true
 *         description: The ID of the client to resume
 *         schema:
 *           type: object
 *           properties:
 *             client_id:
 *               type: integer
 *     responses:
 *       200:
 *         description: Client connection resumed successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Error resuming client connection
 */
router.post('/resume', async (req, res) => {
    const { client_id } = req.body;
    try {
        await resumeClient(client_id);
        res.status(200).send('Client connection resumed successfully');
    } catch (err) {
        res.status(500).send('Error resuming client connection');
    }
});

/**
 * @swagger
 * /control/ban:
 *   post:
 *     summary: Ban a client
 *     tags: [Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: client_id
 *         required: true
 *         description: The ID of the client to ban
 *         schema:
 *           type: object
 *           properties:
 *             client_id:
 *               type: integer
 *     responses:
 *       200:
 *         description: Client banned successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Error banning client
 */
router.post('/ban', async (req, res) => {
    const { client_id } = req.body;
    try {
        await banClient(client_id);
        res.status(200).send('Client banned successfully');
    } catch (err) {
        res.status(500).send('Error banning client');
    }
});

/**
 * @swagger
 * /control/adjust-bandwidth:
 *   post:
 *     summary: Adjust a client's bandwidth limit
 *     tags: [Control]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: client_data
 *         required: true
 *         description: The ID of the client and the new bandwidth limit
 *         schema:
 *           type: object
 *           properties:
 *             client_id:
 *               type: integer
 *             new_limit:
 *               type: number
 *               format: float
 *     responses:
 *       200:
 *         description: Client bandwidth limit adjusted successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Error adjusting client bandwidth limit
 */
router.post('/adjust-bandwidth', async (req, res) => {
    const { client_id, new_limit } = req.body;
    try {
        await adjustBandwidthLimit(client_id, new_limit);
        res.status(200).send('Client bandwidth limit adjusted successfully');
    } catch (err) {
        res.status(500).send('Error adjusting client bandwidth limit');
    }
});

module.exports = router;
