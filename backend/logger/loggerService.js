const morganLogger = require("./morgan/morganLogger");

// экспортируем middleware, а не фабрику
module.exports = function loggerMiddleware(req, res, next) {
  const logger = (process.env.LOGGER || "").toLowerCase();

  if (logger === "morgan") {
    return morganLogger(req, res, next);
  }

  return next();
};



