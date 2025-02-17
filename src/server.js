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
const { simulateTraffic } = require('./services/trafficSimulationService');
const cors = require('cors');



const app = express();
const PORT = 3002;


const CLIENT_ORIGIN = 'http://localhost:3000';

app.use(cors({
    origin: CLIENT_ORIGIN, // Allow your frontend origin
    credentials: true // Allow cookies to be sent with CORS requests
}));


// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Enhanced Quality of Experience (QoE) for Satellite Broadband Users',
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
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'Xh8zA1q2k6T5sL9uJf3vPz8yRg7Dq4hR',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    }
}));

// Middleware to ensure authentication on protected routes
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/login'); // Redirect to login if not authenticated
}

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
