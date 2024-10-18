const { createClient } = require('../services/clientService');
const { logBandwidthUsage, getBandwidthUsage, checkAllTables } = require('../services/bandwidthService');
const { downloadFile } = require('../services/fileService');

const createClientHandler = async (req, res) => {
    const { name, max_bandwidth, committed_ip_rate } = req.body;
    try {
        const client = await createClient(name, max_bandwidth, committed_ip_rate);
        res.status(201).json(client);
    } catch (err) {
        console.error('Error creating client', err);
        res.status(500).json({ error: 'Error creating client' });
    }
};

const checkAllTablesHandler = async (req, res) => {
    try {
        const tables = await checkAllTables();
        res.json(tables);
    } catch (err) {
        console.error('Error retrieving tables', err);
        res.status(500).json({ error: 'Error retrieving tables' });
    }
};

const logBandwidthUsageHandler = async (req, res) => {
    const { client_id, allocated_bandwidth } = req.body;
    try {
        await logBandwidthUsage(client_id, allocated_bandwidth);
        res.status(201).json({ message: 'Bandwidth usage logged successfully' });
    } catch (err) {
        console.error('Error logging bandwidth usage', err);
        res.status(500).json({ error: 'Error logging bandwidth usage' });
    }
};

const getBandwidthUsageHandler = async (req, res) => {
    const { client_id } = req.params;
    try {
        const usage = await getBandwidthUsage(client_id);
        res.json(usage);
    } catch (err) {
        console.error('Error retrieving bandwidth usage', err);
        res.status(500).json({ error: 'Error retrieving bandwidth usage' });
    }
};

const downloadFileHandler = (req, res) => {
    const clientId = req.query.client_id || '0';
    console.log(`Download requested by client: ${clientId}`);
    downloadFile(clientId, res);
};

module.exports = { createClientHandler, checkAllTablesHandler, logBandwidthUsageHandler, getBandwidthUsageHandler, downloadFileHandler };