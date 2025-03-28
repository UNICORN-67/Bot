const fs = require("fs");
const path = require("path");
const Log = require("../database/logModel");

const logFilePath = path.join(__dirname, "../../logs/bot.log");

// 📌 Function to log actions in both MongoDB & local file
const logAction = async (action, user, admin, chat) => {
  try {
    const logEntry = new Log({
      action,
      user: {
        id: user.id,
        username: user.username || "N/A",
        first_name: user.first_name,
      },
      admin: {
        id: admin.id,
        username: admin.username || "N/A",
        first_name: admin.first_name,
      },
      chat: {
        id: chat.id,
        title: chat.title || "Private Chat",
      },
    });

    await logEntry.save(); // Save to MongoDB

    // Create log text format
    const logText = `[${new Date().toISOString()}] [${chat.title}] ${admin.first_name} (${admin.id}) ${action} ${user.first_name} (${user.id})\n`;

    // Append log to file
    fs.appendFile(logFilePath, logText, (err) => {
      if (err) console.error("❌ File Logging Error:", err);
    });

    console.log(`✅ Logged: ${action} - ${user.first_name} by ${admin.first_name}`);
  } catch (err) {
    console.error("❌ Logging Error:", err);
  }
};

module.exports = logAction;
