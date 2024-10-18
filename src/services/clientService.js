const db = require('../db/db'); // Assume this is your database connection module

/**
 * Fetches the maximum bandwidth for a given client ID from the database.
 * @param {string} clientId - The ID of the client.
 * @returns {Promise<number>} - The maximum bandwidth for the client in bytes per second.
 */
async function getClientMaxBandwidth(clientId) {
    try {
        const result = await db.query(
            'SELECT max_bandwidth FROM clients WHERE id = $1',
            [clientId]
        );

        if (result.rows.length > 0) {
            return result.rows[0].max_bandwidth * 1024; // Convert from KB to bytes
        } else {
            throw new Error('Client not found');
        }
    } catch (err) {
        console.error('Error fetching max bandwidth:', err);
        throw err;
    }
}

/**
 * Fetches all clients and their information from the database.
 * @returns {Promise<Array>} - An array of client objects.
 */
async function getAllClients() {
    try {
        const result = await db.query('SELECT * FROM clients');
        return result.rows;
    } catch (err) {
        console.error('Error fetching clients:', err);
        throw err;
    }
}

/**
 * Creates a new client in the database.
 * @param {Object} clientData - The data for the new client.
 * @returns {Promise<Object>} - The created client object.
 */
async function createClient(clientData) {
    const { client_name, max_bandwidth, cir, ip_address, mac_address, device_type } = clientData;
    try {
        const result = await db.query(
            'INSERT INTO clients (client_name, max_bandwidth, cir, ip_address, mac_address, device_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [client_name, max_bandwidth, cir, ip_address, mac_address, device_type]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error creating client:', err);
        throw err;
    }
}

/**
 * Deletes a client from the database.
 * @param {number} clientId - The ID of the client to delete.
 * @returns {Promise<void>}
 */
async function deleteClient(clientId) {
    try {
        // First, delete associated bandwidth stats
        await db.query('DELETE FROM bandwidth_stats WHERE client_id = $1', [clientId]);
        
        // Then, delete the client
        await db.query('DELETE FROM clients WHERE id = $1', [clientId]);
    } catch (err) {
        console.error('Error deleting client:', err);
        throw err;
    }
}

module.exports = { getClientMaxBandwidth, getAllClients, createClient, deleteClient };
