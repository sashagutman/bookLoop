const cors = require("cors");

const fromEnv = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = fromEnv.length ? fromEnv : [
  "http://localhost:5173", // локальный фронт
  // "https://bookloop-staging.onrender.com",
];

module.exports = cors({
  origin: allowedOrigins,
  credentials: true,
});
