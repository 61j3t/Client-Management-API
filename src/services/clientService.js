const { pool } = require('../db/db');

const createClient = async (name, max_bandwidth, committed_ip_rate) => {
    console.log()
    const result = await pool.query(
        'INSERT INTO clients (client_name, max_bandwidth, cir) VALUES ($1, $2, $3) RETURNING *',
        [name, max_bandwidth, committed_ip_rate]
    );
    return result.rows[0];
};

module.exports = { createClient };