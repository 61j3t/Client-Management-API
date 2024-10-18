// server.js

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const clientRoutes = require('./routes/clientRoutes');
const controlRoutes = require('./routes/controlRoutes');
const bandwidthRoutes = require('./routes/bandwidthRoutes'); // Import bandwidth routes
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { simulateTraffic } = require('./services/trafficSimulationService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // This line is crucial for parsing URL-encoded data

// Session setup
app.use(session({
    secret: 'your-secret', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
}));

// Use routes
app.use(adminRoutes);
app.use(downloadRoutes);
app.use(clientRoutes);
app.use(controlRoutes);
app.use('/bandwidth', bandwidthRoutes); // Use bandwidth routes

// Start traffic simulation
simulateTraffic();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
