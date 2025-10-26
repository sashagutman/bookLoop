const chalk = require("chalk");

const createError = (source, message, status = 400) => {
  const text = `${source ? `${source} ` : ""}Error: ${message}`;
  const err = new Error(text);
  err.status = status;
  err.source = source;
  err.isOperational = true;
  err.isError = true;          
  return err;
};

const handleError = (res, status = 500, message = "Server error", extra = {}) => {
  res.locals.errorMessage = message;
  console.log(chalk.redBright(`[${status}] ${message}`));
  return res.status(status).send(message); 
};

module.exports = { createError, handleError };
