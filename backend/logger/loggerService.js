require("dotenv").config();
const morganLogger = require("./morgan/morganLogger");

const logger = process.env.LOGGER;

const loggerMiddleware = () => {
  if (logger === "morgan") {
    return morganLogger;
  }
};

module.exports = loggerMiddleware;
