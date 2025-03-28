const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const config = require("./config/config"); // ✅ Importing config.js

// Import Commands
const adminCommands = require("./commands/admin");
const generalCommands = require("./commands/general");
const pingCommand = require("./commands/ping");

// Initialize Bot
const bot = new Telegraf(config.BOT_TOKEN);

// ✅ MongoDB Connection Function
async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
        });

        mongoose.connection.on("connected", () => logger.info("✅ MongoDB Connected Successfully."));
        mongoose.connection.on("error", (err) => logger.error(`❌ MongoDB Error: ${err.message}`));
        mongoose.connection.on("disconnected", () => {
            logger.warn("⚠️ MongoDB Disconnected! Reconnecting...");
            reconnectDB();
        });

    } catch (err) {
        logger.error(`❌ MongoDB Connection Failed: ${err.message}`);
        process.exit(1);
    }
}

// ✅ Auto-Reconnect Function
function reconnectDB() {
    setTimeout(() => {
        logger.info("🔄 Attempting MongoDB Reconnection...");
        connectDB();
    }, 5000);
}

// ✅ Start Command
bot.start((ctx) => {
    ctx.reply("👋 Welcome! Use /help for commands.");
    logger.info(`User ${ctx.from.username || "Unknown"} (ID: ${ctx.from.id}) started the bot.`);
});

// ✅ Help Command
bot.help((ctx) => {
    ctx.reply("📌 Available commands:\n/start, /ping, /ban, /unban, /mute, /promote, /demote.");
});

// ✅ Ping Command
bot.command("ping", async (ctx) => {
    await pingCommand.ping(ctx);
});

// ✅ Admin Commands (Only Work in Groups)
["ban", "unban", "mute", "promote", "demote"].forEach((cmd) => {
    bot.command(cmd, async (ctx) => {
        if (ctx.chat.type !== "private") {
            await adminCommands[cmd](ctx);
        } else {
            ctx.reply("⚠️ This command can only be used in groups.");
        }
    });
});

// ✅ General Text Handler
bot.on("text", async (ctx) => {
    await generalCommands.handleText(ctx);
});

// ✅ Error Handling
bot.catch((err, ctx) => {
    logger.error(`❌ Bot Error: ${err.message}`);
    ctx.reply("⚠️ An error occurred. Please try again later.");
});

// ✅ Graceful Shutdown for MongoDB
const shutdownBot = (signal) => {
    bot.stop(signal);
    mongoose.connection.close(() => logger.info(`⚠️ MongoDB Disconnected. Bot stopped (${signal}).`));
};

process.on("SIGINT", () => shutdownBot("SIGINT"));
process.on("SIGTERM", () => shutdownBot("SIGTERM"));

// ✅ Start Bot with MongoDB Connection
(async () => {
    await connectDB();
    bot.launch()
        .then(() => logger.info("🚀 Bot started successfully."))
        .catch((err) => {
            logger.error(`❌ Bot launch failed: ${err.message}`);
            process.exit(1);
        });
})();
