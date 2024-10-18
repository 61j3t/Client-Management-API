const { logBandwidthUsage } = require('./bandwidthService');
const { getAllClients } = require('./clientService');

const simulateTraffic = async () => {
    const clients = await getAllClients();
    const simulationInterval = 1000; // Simulate every second

    setInterval(async () => {
        // Randomly determine how many clients will make requests this interval
        const activeClientsCount = Math.floor(Math.random() * clients.length) + 1; // At least one client
        const activeClients = [];

        // Randomly select clients to simulate activity
        while (activeClients.length < activeClientsCount) {
            const randomIndex = Math.floor(Math.random() * clients.length);
            if (!activeClients.includes(clients[randomIndex])) {
                activeClients.push(clients[randomIndex]);
            }
        }

        for (const client of activeClients) {
            const minBandwidth = client.cir; // Use CIR as the minimum
            const maxBandwidth = client.max_bandwidth; // Use max bandwidth as the maximum
            const simulatedBandwidth = Math.round(Math.random() * (maxBandwidth - minBandwidth) + minBandwidth * 100) / 100; // Random bandwidth usage between CIR and max_bandwidth
            const timestamp = new Date().toISOString();
            const sessionId = 'session_' + Math.floor(Math.random() * 1000); // Simulate a random session ID
            const status = 'active'; // You can set this based on your logic

            await logBandwidthUsage(client.id, simulatedBandwidth, timestamp, sessionId, status);
        }
    }, simulationInterval);
};

module.exports = { simulateTraffic };
