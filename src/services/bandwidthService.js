const pool = require('../db/db');

const logBandwidthUsage = async (client_id, kbps, timestamp) => {
    try {
        await pool.query(
            'INSERT INTO bandwidth_stats (client_id, requested_bandwidth, timestamp) VALUES ($1, $2, $3)',
            [client_id, kbps, timestamp]
        );
        console.log(`${timestamp} client: ${client_id}: ${kbps} kbps`);
    } catch (err) {
        console.error('Error logging bandwidth usage', err);
    }
};

module.exports = { logBandwidthUsage };