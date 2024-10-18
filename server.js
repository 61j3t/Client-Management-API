// server.js

const express = require('express');
const path = require('path')
const Throttle = require('throttle');
const fs = require('fs')
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create a new pool instance
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Middleware to parse JSON requests
app.use(express.json());

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()'); // Just getting the current time from the DB
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Database connection error', err);
        res.status(500).json({ error: 'Database connection error' });
    }
});

app.post('/clients', async (req, res) => {
    const { name, max_bandwidth, committed_ip_rate } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO clients (client_name, max_bandwidth, cir) VALUES ($1, $2, $3) RETURNING *',
            [name, max_bandwidth, committed_ip_rate]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating client', err);
        res.status(500).json({ error: 'Error creating client' });
    }
});

// API route to log bandwidth usage
app.post('/bandwidth-usage', async (req, res) => {
    const { client_id, requested_bandwidth } = req.body; // Get requested bandwidth from the request
    const allocated_bandwidth = BANDWIDTH_LIMIT; // Use the defined limit as allocated bandwidth

    try {
        const result = await pool.query(
            'INSERT INTO bandwidth_stats (client_id, requested_bandwidth, allocated_bandwidth) VALUES ($1, $2, $3) RETURNING *',
            [client_id, requested_bandwidth, allocated_bandwidth] // Log both requested and allocated bandwidth
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error logging bandwidth usage', err);
        res.status(500).json({ error: 'Error logging bandwidth usage' });
    }
});

// API route to get bandwidth usage for a client
app.get('/bandwidth-usage/:client_id', async (req, res) => {
    const { client_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM bandwidth_usage WHERE client_id = $1 ORDER BY timestamp DESC',
            [client_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving bandwidth usage', err);
        res.status(500).json({ error: 'Error retrieving bandwidth usage' });
    }
});

// Object to store bandwidth usage for each client
const clientBandwidthUsage = {};

// Set a bandwidth limit to 1.5 MB per second
const BANDWIDTH_LIMIT = 1.5 * 1024 * 1024; // 1.5 MB in bytes

app.get('/download', (req, res) => {
    const clientId = req.query.client_id || 'unknown'; // Get client ID from query parameter
    console.log(`Download requested by client: ${clientId}`);
    const filePath = path.join(__dirname, 'file.zip'); // Update path if needed

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    const stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'application/zip', // Change to appropriate type
        'Content-Length': stat.size,
    });

    const readStream = fs.createReadStream(filePath);
    const throttle = new Throttle(BANDWIDTH_LIMIT); // Create a throttle stream

    // Create a variable to track the total bytes sent
    let totalBytesSent = 0;
    const startTime = Date.now();

    // Initialize bandwidth usage for the client
    clientBandwidthUsage[clientId] = { totalBytesSent: 0, startTime, kbps: 0 };

    // Set an interval to log bandwidth usage every second
    const logInterval = setInterval(async () => {
        const elapsedTime = (Date.now() - clientBandwidthUsage[clientId].startTime) / 1000; // Time in seconds

        // Ensure elapsedTime is greater than zero to avoid NaN
        const kbps = elapsedTime > 0 
            ? (clientBandwidthUsage[clientId].totalBytesSent * 8) / 1024 / elapsedTime // Convert to kbps
            : 0; // Default to 0 if elapsedTime is not valid

        // Get the current timestamp for logging
        const timestamp = new Date().toISOString(); // Get the current timestamp in ISO format

        // Log the kbps for the specific client with timestamp
        console.log(`[${timestamp}] ${clientId} bw: ${kbps.toFixed(2)} kbps`);

        // Log bandwidth usage to the database
        const clientIdInt = parseInt(clientId, 10); // Ensure clientId is an integer
        try {
            await pool.query(
                'INSERT INTO bandwidth_stats (client_id, requested_bandwidth, allocated_bandwidth, timestamp) VALUES ($1, $2, $3, $4)',
                [clientIdInt, kbps, BANDWIDTH_LIMIT, timestamp] // Include timestamp in the query
            );
        } catch (err) {
            console.error('Error logging bandwidth usage to database', err);
        }
    }, 1000); // Log every second

    // Pipe the read stream through the throttle to the response
    readStream.pipe(throttle).pipe(res);

    throttle.on('data', (chunk) => {
        totalBytesSent += chunk.length; // Update the total bytes sent
        clientBandwidthUsage[clientId].totalBytesSent += chunk.length; // Update client's total bytes sent
    });

    readStream.on('end', () => {
        console.log(`Download complete for client: ${clientId}`);
        clearInterval(logInterval); // Clear the interval when the download is complete
    });

    readStream.on('error', (err) => {
        console.error('Stream error:', err);
        res.status(500).send('Internal Server Error');
        clearInterval(logInterval); // Clear the interval on error
    });
});

async function logBandwidthUsage(bandwidth) {
    // Check if bandwidth is a valid number
    if (isNaN(bandwidth) || bandwidth === null) {
        console.error("Invalid bandwidth value:", bandwidth);
        return; // Exit the function if the value is invalid
    }

    // Convert bandwidth to an integer
    const bandwidthInt = parseInt(bandwidth, 10);

    // Print the bandwidth usage instead of logging to the database
    console.log("Bandwidth usage:", bandwidthInt);
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
