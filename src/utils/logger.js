const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

// ✅ Ensure Logs Directory Exists
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// ✅ Define Log Format
const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
        // Ensure message is always a string to prevent TypeErrors
        const safeMessage = typeof message === "string" ? message : JSON.stringify(message, null, 2);
        return `${timestamp} [${level.toUpperCase()}]: ${safeMessage}`;
    })
);

// ✅ Create Logger
const logger = createLogger({
    level: "info", // Log levels: error, warn, info, http, verbose, debug, silly
    format: logFormat,
    transports: [
        new transports.Console({ format: format.combine(format.colorize(), logFormat) }),
        new transports.File({ filename: path.join(logDir, "bot.log"), level: "info" }),
        new transports.File({ filename: path.join(logDir, "error.log"), level: "error" })
    ]
});

// ✅ Safe Logger Wrapper to Avoid TypeErrors
const safeLogger = {
    info: (msg) => logger.info(typeof msg === "string" ? msg : JSON.stringify(msg, null, 2)),
    warn: (msg) => logger.warn(typeof msg === "string" ? msg : JSON.stringify(msg, null, 2)),
    error: (msg) => logger.error(typeof msg === "string" ? msg : JSON.stringify(msg, null, 2))
};

module.exports = safeLogger;
