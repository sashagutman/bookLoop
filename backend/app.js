require("dotenv").config();

const express = require("express");
const chalk = require("chalk");

const corsMiddleware = require("./middlewares/cors");
const router = require("./router/router");
const loggerMiddleware = require("./logger/loggerService");
const connectToDB = require("./DB/dbService");
const { handleError } = require("./utils/handleErrors");

const app = express();
const PORT = process.env.PORT || 5566;

app.use(express.json());
app.use(corsMiddleware);
app.use(loggerMiddleware);

app.set("etag", false);

// Disable caching for API responses
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err);
  return handleError(res, 500, "Internal Server Error");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(chalk.green.bold.bgYellow(`App is listening on port ${PORT}`));
  connectToDB();
});
