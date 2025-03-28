 require("dotenv").config();
const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./config/config");

// Import Commands
const adminCommands = require("./commands/admin");
const generalCommands = require("./commands/general");
const pingCommand = require("./commands/ping");
const idCommand = require("./commands/id");
const userInfoCommand = require("./commands/userinfo");

// Ensure required environment variables are loaded
if (!config.BOT_TOKEN || !config.MONGO_URI) {
    logger.error("Missing BOT_TOKEN or MONGO_URI in config.");
    process.exit(1);
}

// Initialize Bot
const bot = new Telegraf(config.BOT_TOKEN);

// MongoDB Connection Handling
async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        mongoose.connection.on("connected", () => logger.info("MongoDB Connected."));
        mongoose.connection.on("error", (err) => logger.error(`MongoDB Error: ${err.message}`));
        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB Disconnected! Reconnecting...");
            setTimeout(connectDB, 5000);
        });
    } catch (err) {
        logger.error(`MongoDB Connection Failed: ${err.message}`);
        process.exit(1);
    }
}

// Start Command
bot.start((ctx) => {
    const user = ctx.from;
    ctx.reply(`👋 Welcome, ${user.first_name || "User"}!
Use /help to see available commands.
🚀 Add me to your group for powerful admin tools!`, { parse_mode: "Markdown" });
    logger.info(`User ${user.username || "Unknown"} (ID: ${user.id}) started the bot.`);
});

// Help Command
bot.help((ctx) => {
    ctx.reply(`🤖 *Bot Commands*  
- /ping - Check bot response time  
- /id - Get your Telegram ID  
- /userinfo - Get user details  
- /help - Show available commands  

📌 *Admin Commands (Group Only)*  
- /ban [reply] - Ban a user  
- /unban [user_id] - Unban a user  
- /mute [reply] - Mute a user  
- /promote [reply] - Promote a user  
- /demote [reply] - Demote a user  
`, { parse_mode: "Markdown" });
});

// Register Commands
bot.command("ping", pingCommand.ping);
bot.command("id", idCommand.id);
bot.command("userinfo", userInfoCommand.userinfo);

// Register Admin Commands (Group Only)
["ban", "unban", "mute", "promote", "demote"].forEach((cmd) => {
    bot.command(cmd, async (ctx) => {
        if (ctx.chat.type !== "private") {
            await adminCommands[cmd](ctx);
        } else {
            ctx.reply("⚠️ This command can only be used in groups.");
        }
    });
});

// Error Handling
bot.catch((err, ctx) => {
    logger.error(`Bot Error: ${err.message}`);
    ctx.reply("⚠️ An error occurred. Please try again later.");
});

// Graceful Shutdown
process.on("SIGINT", () => {
    bot.stop("SIGINT");
    mongoose.connection.close(() => logger.info("MongoDB Disconnected. Bot stopped."));
});

process.on("SIGTERM", () => {
    bot.stop("SIGTERM");
    mongoose.connection.close(() => logger.info("MongoDB Disconnected. Bot stopped."));
});

// Start Bot
(async () => {
    await connectDB();
    bot.launch()
        .then(() => logger.info("🚀 Bot started successfully."))
        .catch((err) => {
            logger.error(`Bot launch failed: ${err.message}`);
            process.exit(1);
        });
})();
