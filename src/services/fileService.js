const path = require('path');
const fs = require('fs');
const Throttle = require('throttle');

const downloadFile = (clientId, res) => {
    const filePath = path.join(__dirname, '../../file.zip');

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    const stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
    });

    const readStream = fs.createReadStream(filePath);
    const throttle = new Throttle(10 * 1024 * 1024); // 1.5 MB in bytes

    readStream.pipe(throttle).pipe(res);
};

module.exports = { downloadFile };