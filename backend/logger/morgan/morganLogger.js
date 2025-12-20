const morgan = require("morgan");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const currentTime = require("../../utils/timeHelper");

const isProd = process.env.NODE_ENV === "production";

// На Render лучше писать в /tmp, а не в папку проекта
const logDirectory = isProd
  ? path.join("/tmp", "logs")
  : path.join(__dirname, "../../logs");

try {
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }
} catch (_) {
  // если нельзя создать — просто не пишем в файл, только stdout
}

const morganLogger = morgan((tokens, req, res) => {
  const { year, month, day, hours, minutes, seconds } = currentTime();
  const dateForFile = `${year}-${month}-${day}`;
  const logFilePath = path.join(logDirectory, `${dateForFile}.log`);

  const msg =
    `[${year}/${month}/${day} ${hours}:${minutes}:${seconds}] ` +
    `${tokens.method(req, res)} ${tokens.url(req, res)} ` +
    `${tokens.status(req, res)} - ${tokens["response-time"](req, res)}ms`;

  // 4xx/5xx — красим в красный и пишем в файл (если возможно)
  if (res.statusCode >= 400) {
    const errorText = res.locals?.errorMessage ? ` | ${res.locals.errorMessage}` : "";
    const line = msg + errorText + "\n";
    try {
      fs.appendFile(logFilePath, line, () => {});
    } catch (_) {
      // игнорируем, логи все равно есть в stdout
    }
    return chalk.redBright(msg);
  }
  // 2xx/3xx — в stdout
  return chalk.cyanBright(msg);
});

module.exports = morganLogger;
