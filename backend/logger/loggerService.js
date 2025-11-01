const morganLogger = require("./morgan/morganLogger");

// безопасная фабрика: ВСЕГДА возвращает функцию
module.exports = () => {
  const logger = (process.env.LOGGER || "").toLowerCase();
  if (logger === "morgan") 
    return morganLogger;
  // no-op логгер по умолчанию (чтобы app.use(...) не падал)
  return (req, res, next) => next();
};
