const { pool } = require('../db/db');

const logBandwidthUsage = async (client_id, allocated_bandwidth) => {
    const timestamp = new Date().toISOString();
    console.log('HI')
    try {
        await pool.query(
            'INSERT INTO public.bandwidth_stats (client_id, requested_bandwidth, timestamp) VALUES ($1, $2, $3)',
            [client_id, allocated_bandwidth, timestamp]
        );
        console.log(`Logged bandwidth usage for client ${client_id}: ${allocated_bandwidth} at ${timestamp}`);
    } catch (err) {
        console.error('Error logging bandwidth usage', err);
    }
};

const getBandwidthUsage = async (client_id) => {
    const result = await pool.query(
        'SELECT * FROM bandwidth_usage WHERE client_id = $1 ORDER BY timestamp DESC',
        [client_id]
    );
    return result.rows;
};

const checkAllTables = async () => {
    const result = await pool.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    return result.rows;
};

module.exports = { logBandwidthUsage, getBandwidthUsage, checkAllTables };
