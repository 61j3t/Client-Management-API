// src/server.js

const express = require('express');
const { connectDB } = require('./db/db'); // Import the database connection
const routes = require('./routes/routes'); // Import routes
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Use routes
app.use(routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});