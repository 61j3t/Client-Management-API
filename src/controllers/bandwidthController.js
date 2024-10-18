const { logBandwidthUsage } = require('../services/bandwidthService');
const Throttle = require('throttle');
const fs = require('fs');
const path = require('path');
const { getClientMaxBandwidth } = require('../services/clientService'); // Assume this service is implemented

const downloadFileHandler = async (req, res) => {
    const clientId = req.query.client_id || 'unknown';
    const filePath = path.join(__dirname, '../../file.zip');

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    let clientBandwidthLimit;
    try {
        clientBandwidthLimit = await getClientMaxBandwidth(clientId);
    } catch (err) {
        console.error('Error fetching client bandwidth limit:', err);
        return res.status(500).send('Internal Server Error');
    }

    const stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
    });

    const readStream = fs.createReadStream(filePath);
    const throttle = new Throttle(clientBandwidthLimit || BANDWIDTH_LIMIT);

    let totalBytesSent = 0;
    const startTime = Date.now();

    const logInterval = setInterval(async () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        let kbps = elapsedTime > 0 ? (totalBytesSent * 8) / 1024 / elapsedTime : 0;
        kbps = Math.round(kbps * 100) / 100; // Round to two decimal places
        const timestamp = new Date().toISOString();

        try {
            await logBandwidthUsage(clientId, kbps, kbps, timestamp); // Removed status
        } catch (err) {
            console.error('Error logging bandwidth usage to database', err);
        }
    }, 1000);

    readStream.pipe(throttle).pipe(res);

    throttle.on('data', (chunk) => {
        totalBytesSent += chunk.length;
    });

    readStream.on('end', () => {
        clearInterval(logInterval);
    });

    readStream.on('error', (err) => {
        console.error('Stream error:', err);
        res.status(500).send('Internal Server Error');
        clearInterval(logInterval);
    });
};

module.exports = { downloadFileHandler };
