const pool = require('../db/db');

const logBandwidthUsage = async (client_id, kbps, timestamp, ipAddress, sessionId, status) => {
    try {
        await pool.query(
            'INSERT INTO bandwidth_stats (client_id, requested_bandwidth, timestamp, ip_address, session_id, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [client_id, kbps, timestamp, ipAddress, sessionId, status]
        );
        console.log(`${timestamp} clientID: ${client_id}: ${kbps} kbps from IP: ${ipAddress}, Session: ${sessionId}, Status: ${status}`);
    } catch (err) {
        console.error('Error logging bandwidth usage', err);
    }
};

module.exports = { logBandwidthUsage };
