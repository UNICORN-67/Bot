const { bot } = require("../bot");
const fs = require("fs");
const path = require("path");
const config = require("../config/config");

const logFilePath = path.join(__dirname, "../logs/bot.log");

// Function to write logs to a file
function writeToFile(message) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error("Error writing to log file:", err);
    });
}

// Function to send logs to a Telegram log channel
async function sendToLogChannel(message) {
    if (config.LOG_CHANNEL_ID) {
        try {
            await bot.telegram.sendMessage(config.LOG_CHANNEL_ID, message, { parse_mode: "Markdown" });
        } catch (error) {
            console.error("Failed to send log to channel:", error.message);
        }
    }
}

// General log function
function logInfo(message) {
    console.log(message);
    writeToFile(`[INFO] ${message}`);
    sendToLogChannel(`📝 *Info:* ${message}`);
}

// Error log function
function logError(error) {
    console.error(error);
    writeToFile(`[ERROR] ${error}`);
    sendToLogChannel(`❌ *Error:* ${error}`);
}

// Log user bans
function logBan(user, admin) {
    const message = `🚫 *User Banned:* ${user.first_name} (${user.id}) by ${admin.first_name} (${admin.id})`;
    logInfo(message);
}

// Log user unbans
function logUnban(user, admin) {
    const message = `✅ *User Unbanned:* ${user.first_name} (${user.id}) by ${admin.first_name} (${admin.id})`;
    logInfo(message);
}

// Log user leaving the group
function logUserLeft(user) {
    const message = `🚪 *User Left:* ${user.first_name} (${user.id})`;
    logInfo(message);
}

module.exports = { logInfo, logError, logBan, logUnban, logUserLeft };
