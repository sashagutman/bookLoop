const cors = require("cors");

// Можно задать CORS_ORIGIN через ENV: "https://front1.com,https://front2.com"
const fromEnv = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = fromEnv.length ? fromEnv : [
  "http://localhost:5173", // локальный фронт
  // Добавь сюда свой фронт на Render после деплоя, например:
  // "https://bookloop-staging.onrender.com",
];

module.exports = cors({
  origin: allowedOrigins,
  credentials: true,
});
