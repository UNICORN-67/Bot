require("dotenv").config();
const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const userInfo = require("./utils/userInfo");

// Import Command Handlers
const adminCommands = require("./commands/admin");
const generalCommands = require("./commands/general");
const pingCommand = require("./commands/ping");

// Initialize Bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ✅ Start Command
bot.start((ctx) => {
    const user = userInfo.getUserInfo(ctx);
    ctx.reply(ctx.chat.type === "private" 
        ? `👋 Welcome, ${user.firstName}!\nUse /help to see available commands.` 
        : `👋 Hello Group Members! I'm here to assist admins. Type /help for commands.`
    );
    logger.info(`User ${user.username} (ID: ${user.id}) started the bot.`);
});

// ✅ Help Command
bot.help((ctx) => {
    ctx.reply("📌 Available commands:\n/start, /ping, /ban, /unban, /mute, /promote, /demote.");
});

// ✅ Ping Command (Latency Check)
bot.command("ping", async (ctx) => {
    await pingCommand.ping(ctx);
});

// ✅ Admin Commands (Only Work in Groups)
const adminOnlyCommands = ["ban", "unban", "mute", "promote", "demote"];
adminOnlyCommands.forEach((cmd) => {
    bot.command(cmd, async (ctx) => {
        if (ctx.chat.type !== "private") {
            await adminCommands[cmd](ctx);
        } else {
            ctx.reply("⚠️ This command can only be used in groups.");
        }
    });
});

// ✅ General Commands
bot.on("text", async (ctx) => {
    await generalCommands.handleText(ctx);
});

// ✅ Error Handling
bot.catch((err, ctx) => {
    logger.error(`❌ Bot Error: ${err.message}`);
    ctx.reply("⚠️ An error occurred. Please try again later.");
});

// ✅ Start Bot with MongoDB Connection
(async () => {
    await connectDB(); // Ensure MongoDB is connected before starting the bot
    bot.launch().then(() => {
        logger.info("🚀 Bot started successfully.");
    }).catch((err) => {
        logger.error(`❌ Bot launch failed: ${err.message}`);
        process.exit(1);
    });
})();

// ✅ Graceful Shutdown
const shutdownBot = (signal) => {
    bot.stop(signal);
    mongoose.connection.close();
    logger.info(`⚠️ Bot stopped gracefully (${signal}).`);
};

process.on("SIGINT", () => shutdownBot("SIGINT"));
process.on("SIGTERM", () => shutdownBot("SIGTERM"));
