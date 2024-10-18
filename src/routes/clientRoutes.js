const express = require('express');
const router = express.Router();
const { getAllClients, createClient } = require('../services/clientService');
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

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_name:
 *                 type: string
 *               max_bandwidth:
 *                 type: number
 *                 format: float
 *               cir:
 *                 type: number
 *                 format: float
 *               ip_address:
 *                 type: string
 *               mac_address:
 *                 type: string
 *               device_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created successfully
 *       500:
 *         description: Error creating client
 */
router.post('/clients', isAuthenticated, async (req, res) => {
    const clientData = req.body;
    try {
        const newClient = await createClient(clientData);
        res.status(201).json(newClient);
    } catch (err) {
        res.status(500).send('Error creating client');
    }
});

module.exports = router;
