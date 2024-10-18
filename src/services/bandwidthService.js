const pool = require('../db/db');

const logBandwidthUsage = async (client_id, kbps, timestamp, sessionId, status) => {
    try {
        await pool.query(
            'INSERT INTO bandwidth_stats (client_id, requested_bandwidth, timestamp, session_id, status) VALUES ($1, $2, $3, $4, $5)',
            [client_id, kbps, timestamp, sessionId, status]
        );
        console.log(`${timestamp} clientID: ${client_id}: ${kbps} kbps, Session: ${sessionId}, Status: ${status}`);
    } catch (err) {
        console.error('Error logging bandwidth usage', err);
    }
};

const getBandwidthRecords = async (clientId, startDate, endDate, status, limit, offset) => {
    try {
        const query = `
            SELECT * FROM bandwidth_stats
            WHERE ($1::int IS NULL OR client_id = $1)
            AND ($2::timestamp IS NULL OR timestamp >= $2)
            AND ($3::timestamp IS NULL OR timestamp <= $3)
            AND ($4::varchar IS NULL OR status = $4)
            ORDER BY timestamp DESC
            LIMIT $5 OFFSET $6
        `;
        const result = await pool.query(query, [clientId, startDate, endDate, status, limit, offset]);
        return result.rows;
    } catch (err) {
        console.error('Error fetching bandwidth records:', err);
        throw err;
    }
};

module.exports = { logBandwidthUsage, getBandwidthRecords };
