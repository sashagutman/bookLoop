require("dotenv").config();

const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const corsMiddleware = require('./middlewares/cors');
const router = require('./router/router');
const loggerMiddleware = require('./logger/loggerService');
const connectToDB = require('./DB/dbService');
const { handleError } = require('./utils/handleErrors');

const app = express();
const PORT = process.env.PORT

// middlewares
app.use(express.json());
app.use(corsMiddleware);
app.use(loggerMiddleware());

// app.use('/api', router);
app.use('/api', router);

app.use((err, req, res, next) => {
  console.log(err);
  return handleError(res, 500, "Internal Server Error");
});

app.listen(PORT, () => {
  console.log(chalk.green.bold.bgYellow("App is listening to port " + PORT));
  connectToDB();
});
