const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const config = require("./config/config");
const adminCommands = require("./commands/admin");
const generalCommands = require("./commands/general");

const bot = new Telegraf(config.BOT_TOKEN);

// Database Connection
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Load Commands
adminCommands(bot);
generalCommands(bot);

// Error Handling
bot.catch((err, ctx) => {
  console.error(`❌ Error in bot: ${err.message}`);
  ctx.reply("⚠️ An unexpected error occurred. Please try again.");
});

// Start Bot
bot.launch()
  .then(() => console.log(`🤖 ${config.BOT_NAME} is running...`))
  .catch((err) => {
    console.error("❌ Bot launch failed:", err);
    process.exit(1);
  });

// Graceful Shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
