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

// Initialize Bot
const bot = new Telegraf(config.BOT_TOKEN);

// ✅ MongoDB Connection
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

// ✅ Start Command (Updated)
bot.start((ctx) => {
    const user = ctx.from;
    const welcomeMessage = `
👋 *Welcome, ${user.first_name || "User"}!*  
I am a Telegram Group Management Bot. Use /help to see what I can do!  

🔹 *Basic Commands:*
  - /help - Show all available commands
  - /ping - Check bot response time
  - /id - Get your Telegram ID
  - /userinfo - Get detailed user info

📢 *Group Admin Features:*
- Ban, mute, promote, demote users.
- Secure & fast moderation.

🚀 Add me to your group and make managing easier!`;

    ctx.reply(welcomeMessage, { parse_mode: "Markdown" });

    // Log User Interaction
    logger.info(`✅ User ${user.username || "Unknown"} (ID: ${user.id}) started the bot.`);
});

// ✅ Help Command (Updated)
bot.help((ctx) => {
    const helpMessage = `
🤖 *Bot Commands Guide*

🔹 *General Commands:*
  - /start - Start the bot
  - /help - Show this help message
  - /ping - Check bot response time
  - /id - Get your Telegram ID
  - /userinfo - Get detailed user info

🔹 *Admin Commands* _(Group Only)_
  - /ban [reply] - Ban a user
  - /unban [user_id] - Unban a user
  - /mute [reply] - Mute a user
  - /promote [reply] - Promote a user to admin
  - /demote [reply] - Demote an admin to a regular user

📌 *Usage Notes:*
- Reply to a user's message when using /ban, /mute, /promote, or /demote.
- /unban requires the user’s Telegram ID.
- Admin commands work only in groups.

📢 *For any issues, contact the bot owner.*`;

    ctx.reply(helpMessage, { parse_mode: "Markdown" });
});

// ✅ Ping Command
bot.command("ping", async (ctx) => {
    await pingCommand.ping(ctx);
});

// ✅ ID Command
bot.command("id", async (ctx) => {
    await idCommand.id(ctx);
});

// ✅ User Info Command
bot.command("userinfo", async (ctx) => {
    await userInfoCommand.userinfo(ctx);
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

// ✅ Graceful Shutdown
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
