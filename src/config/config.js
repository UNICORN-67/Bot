require("dotenv").config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN || "",
  MONGO_URI: process.env.MONGO_URI || "",
  OWNER_ID: process.env.OWNER_ID ? parseInt(process.env.OWNER_ID) : null,
  LOGGING_ENABLED: process.env.LOGGING_ENABLED === "true",
  BOT_NAME: process.env.BOT_NAME || "TelegramGroupBot",
  API_ID: process.env.API_ID ? parseInt(process.env.API_ID) : null,
  API_HASH: process.env.API_HASH || "",
};
