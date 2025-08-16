require('dotenv').config();
const app = require('./src/app');
const https = require('https')
const fs = require('fs');

const port = process.env.PORT || 3000;

const httpsOptions = {
    key: fs.readFileSync('./src/config/server.key'),
    cert: fs.readFileSync('./src/config/server.cert')
};

https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`Server running at https://localhost:${port}`);
});