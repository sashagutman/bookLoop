const chalk = require("chalk");

const createError = (source, message, status = 400, details = null) => {
  const err = new Error(message);
  err.status = status;
  err.source = source;
  err.isOperational = true;
  err.isError = true;     
  if (details) err.details = details;     
  return err;
};

const errorToResponse = (err) => ({
  status: err.status || 500,
  source: err.source || "Server",
  message: err.message || "Server error",
  isOperational: !!err.isOperational,
  isError: true, 
  ...(err.details ? { details: err.details } : {}),
});

const handleError = (res, status = 500, message = "Server error") => {
  console.log(chalk.redBright(`[${status}] ${message}`));
  return res.status(status).json({
    status,
    source: "Server",
    message,
    isOperational: true,
    isError: true,
  });
};

module.exports = { createError, errorToResponse, handleError };
