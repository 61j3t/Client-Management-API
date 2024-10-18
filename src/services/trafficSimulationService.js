const { logBandwidthUsage } = require('./bandwidthService');
const { getAllClients } = require('./clientService');

const simulateTraffic = async () => {
    const clients = await getAllClients();
    const simulationInterval = 1000; // Simulate every second

    setInterval(async () => {
        for (const client of clients) {
            const minBandwidth = client.cir; // Use CIR as the minimum
            const maxBandwidth = client.max_bandwidth; // Use max bandwidth as the maximum
            const simulatedBandwidth = Math.round(Math.random() * (maxBandwidth - minBandwidth) + minBandwidth * 100) / 100; // Random bandwidth usage between CIR and max_bandwidth
            const timestamp = new Date().toISOString();
            const ipAddress = '192.168.1.' + Math.floor(Math.random() * 256); // Simulate a random IP address
            const sessionId = 'session_' + Math.floor(Math.random() * 1000); // Simulate a random session ID
            const status = 'active'; // You can set this based on your logic

            await logBandwidthUsage(client.id, simulatedBandwidth, timestamp, ipAddress, sessionId, status);
        }
    }, simulationInterval);
};

module.exports = { simulateTraffic };
