const cors = require('cors');

const corsMiddleware = cors ({
    origin: [
        "http://localhost:27017",
        "http://localhost:5173",
        "http://www.example.com",
    ],
    credentials: true,
})

module.exports = corsMiddleware;