require('dotenv').config();
const app = require('./src/app');
const https = require('https')
const fs = require('fs');
const { Server } = require("socket.io");
const { setupSocket } = require('./src/socket');

const port = process.env.PORT || 3000;

const httpsOptions = {
    key: fs.readFileSync('./src/config/localhost-key.pem'),
    cert: fs.readFileSync('./src/config/localhost.pem')
};

const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(port, () => {
    console.log(`Server running at https://localhost:${port}`);
});

const io = new Server(
    httpsServer, {
    cors: {
        origin: process.env.FE_URL,
        methods: ['GET', 'POST']
    }
});

setupSocket(io);
