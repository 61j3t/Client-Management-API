const express = require('express');
const router = express.Router();
const { getAllClients } = require('../services/clientService');
const { isAuthenticated } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management operations
 */

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Retrieve a list of clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   client_name:
 *                     type: string
 *                     example: "Client A"
 *                   max_bandwidth:
 *                     type: number
 *                     format: float
 *                     example: 1024.00
 *                   cir:
 *                     type: number
 *                     format: float
 *                     example: 512.00
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T00:00:00Z"
 *       500:
 *         description: Error fetching clients
 */
router.get('/clients', isAuthenticated, async (req, res) => {
    try {
        const clients = await getAllClients();
        res.json(clients);
    } catch (err) {
        res.status(500).send('Error fetching clients');
    }
});

module.exports = router;
