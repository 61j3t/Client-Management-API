const { logBandwidthUsage } = require('./bandwidthService');
const { getAllClients } = require('./clientService');

const TOTAL_BANDWIDTH_LIMIT = 10; // Define the total bandwidth limit in kbps

const simulateTraffic = async () => {
    const clients = await getAllClients();
    const simulationInterval = 1000; // Simulate every second

    setInterval(async () => {
        const activeClientsCount = Math.floor(Math.random() * clients.length) + 1; // At least one client
        const activeClients = [];

        // Randomly select clients to simulate activity
        while (activeClients.length < activeClientsCount) {
            const randomIndex = Math.floor(Math.random() * clients.length);
            if (!activeClients.includes(clients[randomIndex])) {
                activeClients.push(clients[randomIndex]);
            }
        }

        let totalBandwidthUsed = 0;

        // First pass: Calculate the total bandwidth that would be used
        for (const client of activeClients) {
            if (client.status === 'paused') {
                continue; // Skip this client if they are paused
            }
            const minBandwidth = client.cir; // Use CIR as the minimum
            const maxBandwidth = client.max_bandwidth; // Use max bandwidth as the maximum
            
            // Simulate bandwidth usage
            const simulatedBandwidth = Math.round(Math.random() * (maxBandwidth * 2 - minBandwidth) + minBandwidth * 100) / 100; // Random bandwidth usage
            totalBandwidthUsed += simulatedBandwidth;
        }

        // Second pass: Adjust bandwidth if total exceeds the limit
        for (const client of activeClients) {
            if (client.status === 'paused') {
                continue; // Skip this client if they are paused
            }
            const minBandwidth = client.cir; // Use CIR as the minimum
            const maxBandwidth = client.max_bandwidth; // Use max bandwidth as the maximum
            
            // Simulate bandwidth usage
            const simulatedBandwidth = Math.round(Math.random() * (maxBandwidth * 2 - minBandwidth) + minBandwidth * 100) / 100; // Random bandwidth usage
            let allocatedBandwidth = simulatedBandwidth;

            if (totalBandwidthUsed > TOTAL_BANDWIDTH_LIMIT) {
                const adjustmentFactor = TOTAL_BANDWIDTH_LIMIT / totalBandwidthUsed;
                allocatedBandwidth = Math.round(simulatedBandwidth * adjustmentFactor * 100) / 100; // Adjusted bandwidth
            }

            const timestamp = new Date().toISOString();

            // Log the bandwidth usage with allocated bandwidth
            await logBandwidthUsage(client.id, simulatedBandwidth, allocatedBandwidth, timestamp);
        }
    }, simulationInterval);
};

module.exports = { simulateTraffic };
