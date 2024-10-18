const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const downloadRoutes = require('./routes/downloadRoutes');

const app = express();
const PORT = 3000;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Use routes
app.use(adminRoutes);
app.use(downloadRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});