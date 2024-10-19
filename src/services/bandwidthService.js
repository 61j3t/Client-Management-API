const pool = require('../db/db');

const logBandwidthUsage = async (client_id, kbps, allocatedKbps, timestamp, totalBandwidthUsed) => {

    try {
        await pool.query(
            'INSERT INTO bandwidth_stats (client_id, requested_bandwidth, allocated_bandwidth, timestamp) VALUES ($1, $2, $3, $4)',
            [client_id, kbps, allocatedKbps, timestamp]
        );
        console.log(`${timestamp} | clientID: ${client_id} | Requested: ${kbps} kbps | Allocated: ${allocatedKbps} kbps | Total Used: ${totalBandwidthUsed} kbps`);
    } catch (err) {
        console.error('Error logging bandwidth usage', err);
    }
};


const getAllBandwidthRecords = async () => {
    try {
        const query = 'SELECT * FROM bandwidth_stats ORDER BY timestamp DESC';
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error fetching bandwidth records:', err);
        throw err;
    }
};

module.exports = { getAllBandwidthRecords };


module.exports = { logBandwidthUsage, getAllBandwidthRecords };
