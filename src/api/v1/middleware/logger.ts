import morgan, { StreamOptions } from "morgan";
import fs from "fs";
import path from "path";

// Logs directory
const logsDir = path.join(__dirname, "../../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Access log stream
const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});

// Error log stream
const errorLogStream: StreamOptions = {
  write: (message) => fs.appendFileSync(path.join(logsDir, "error.log"), message),
};

// Morgan loggers
const accessLogger = morgan("combined", { stream: accessLogStream });
const errorLogger = morgan("combined", {
  stream: errorLogStream,
  skip: (req, res) => res.statusCode < 400,
});
const consoleLogger = morgan("dev");

export { accessLogger, errorLogger, consoleLogger };
