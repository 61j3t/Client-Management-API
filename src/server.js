const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const bandwidthRoutes = require('./routes/bandwidthRoutes');
const clientRoutes = require('./routes/clientRoutes');
const controlRoutes = require('./routes/controlRoutes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { simulateTraffic } = require('./services/trafficSimulationService'); // Import the traffic simulation service

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Client Management API',
            version: '1.0.0',
            description: 'API documentation for managing clients and bandwidth',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to parse URL-encoded data

// Session setup
app.use(session({
    secret: 'your-secret', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Use routes
app.use(adminRoutes);
app.use(downloadRoutes);
app.use(clientRoutes);
app.use('/control', controlRoutes);
app.use(bandwidthRoutes);

// Start traffic simulation
simulateTraffic();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
