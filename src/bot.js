require("dotenv").config();
const { Telegraf } = require("telegraf");
const mongoose = require("../src/database/connection");
const logger = require("./utils/logger");
const userInfo = require("./utils/userInfo");

// Import Command Handlers
const adminCommands = require("./commands/admin");
const generalCommands = require("./commands/general");
const pingCommand = require("./commands/ping");

// Initialize Bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// ✅ Ensure MongoDB Connection Before Starting
mongoose.connection.once("open", () => {
    logger.info("Connected to MongoDB.");
}).on("error", (err) => {
    logger.error(`MongoDB Connection Error: ${err.message}`);
});

// ✅ Start Command
bot.start((ctx) => {
    const user = userInfo.getUserInfo(ctx);
    logger.info(`User ${user.username} (ID: ${user.id}) started the bot.`);
    ctx.reply(`Welcome, ${user.firstName}! Use /help to see available commands.`);
});

// ✅ Help Command
bot.help((ctx) => {
    ctx.reply("Available commands: /start, /ping, /ban, /unban, /mute, /promote, /demote.");
});

// ✅ Ping Command (Latency Check)
bot.command("ping", (ctx) => pingCommand.ping(ctx));

// ✅ Admin Commands
bot.command("ban", (ctx) => adminCommands.ban(ctx));
bot.command("unban", (ctx) => adminCommands.unban(ctx));
bot.command("mute", (ctx) => adminCommands.mute(ctx));
bot.command("promote", (ctx) => adminCommands.promote(ctx));
bot.command("demote", (ctx) => adminCommands.demote(ctx));

// ✅ General Commands
bot.on("text", (ctx) => generalCommands.handleText(ctx));

// ✅ Error Handling
bot.catch((err, ctx) => {
    logger.error(`Error in bot: ${err.message}`);
    ctx.reply("⚠️ An error occurred. Please try again later.");
});

// ✅ Start Bot
bot.launch().then(() => {
    logger.info("Bot started successfully.");
}).catch((err) => {
    logger.error(`Bot launch failed: ${err.message}`);
});

// ✅ Graceful Shutdown
process.on("SIGINT", () => {
    bot.stop("SIGINT");
    logger.info("Bot stopped gracefully.");
});
process.on("SIGTERM", () => {
    bot.stop("SIGTERM");
    logger.info("Bot stopped gracefully.");
});
