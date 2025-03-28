require("dotenv").config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN || "8041760696:AAFCX7zf9pquBLU8RybFcAv6TtXCybdsa58",
  MONGO_URI: process.env.MONGO_URI || "mongodb+srv://parthtsingh:parthsingh@cluster0.a2hzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  OWNER_ID: process.env.OWNER_ID ? parseInt(process.env.OWNER_ID) : 7661577681,
  LOGGING_ENABLED: process.env.LOGGING_ENABLED === "true",
  BOT_NAME: process.env.BOT_NAME || "GroupBot",
  API_ID: process.env.API_ID ? parseInt(process.env.API_ID) : 9683694,
  API_HASH: process.env.API_HASH || "c426d9f7087744afdafc961a620b6338",
};
