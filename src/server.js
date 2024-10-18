const express = require('express');
const { downloadFileHandler } = require('./controllers/bandwidthController');

const app = express();
const PORT = 3000;

app.get('/download', downloadFileHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});