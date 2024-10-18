// src/controllers/bandwidth.js

const { pool } = require('../db/db');
const path = require('path');
const fs = require('fs');
const Throttle = require('throttle');

const clientBandwidthUsage = {};
const BANDWIDTH_LIMIT = 1.5 * 1024 * 1024; // 1.5 MB in bytes

const createClient = async (req, res) => {
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
};

const logBandwidthUsage = async (req, res) => {
    const { client_id, requested_bandwidth } = req.body;
    const allocated_bandwidth = BANDWIDTH_LIMIT;

    try {
        const result = await pool.query(
            'INSERT INTO bandwidth_stats (client_id, requested_bandwidth, allocated_bandwidth) VALUES ($1, $2, $3) RETURNING *',
            [client_id, requested_bandwidth, allocated_bandwidth]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error logging bandwidth usage', err);
        res.status(500).json({ error: 'Error logging bandwidth usage' });
    }
};

const getBandwidthUsage = async (req, res) => {
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
};

const downloadFile = (req, res) => {
    const clientId = req.query.client_id || 'unknown';
    console.log(`Download requested by client: ${clientId}`);
    const filePath = path.join(__dirname, '../..//file.zip'); // Update path if needed

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    const stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
    });

    const readStream = fs.createReadStream(filePath);
    const throttle = new Throttle(BANDWIDTH_LIMIT);

    let totalBytesSent = 0;
    const startTime = Date.now();

    clientBandwidthUsage[clientId] = { totalBytesSent: 0, startTime, kbps: 0 };

    const logInterval = setInterval(async () => {
        const elapsedTime = (Date.now() - clientBandwidthUsage[clientId].startTime) / 1000;
        const kbps = elapsedTime > 0 
            ? (clientBandwidthUsage[clientId].totalBytesSent * 8) / 1024 / elapsedTime 
            : 0;

        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${clientId} bw: ${kbps.toFixed(2)} kbps`);
    }, 1000);

    readStream.pipe(throttle).pipe(res);

    throttle.on('data', (chunk) => {
        totalBytesSent += chunk.length;
        clientBandwidthUsage[clientId].totalBytesSent += chunk.length;
    });

    readStream.on('end', () => {
        console.log(`Download complete for client: ${clientId}`);
        clearInterval(logInterval);
    });

    readStream.on('error', (err) => {
        console.error('Stream error:', err);
        res.status(500).send('Internal Server Error');
        clearInterval(logInterval);
    });
};

module.exports = { createClient, logBandwidthUsage, getBandwidthUsage, downloadFile };