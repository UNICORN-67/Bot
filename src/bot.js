const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const config = require('./config/config');
const logger = require('./utils/logger');

// Import all commands
const userinfo = require('./commands/userinfo');
const idCommand = require('./commands/id');
const adminCommands = require('./commands/admin');
const generalCommands = require('./commands/general');
const pingCommand = require('./commands/ping');

const bot = new Telegraf(config.BOT_TOKEN);

// ✅ MongoDB Connection
async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');
        logger.info('MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        logger.error('MongoDB Connection Error:', error);
        process.exit(1); // Exit if database connection fails
    }
}

// ✅ Load Commands
function loadCommands() {
    try {
        userinfo(bot);
        idCommand(bot);
        adminCommands(bot);
        generalCommands(bot);
        pingCommand(bot);
        console.log('✅ All commands loaded successfully');
        logger.info('All commands loaded');
    } catch (error) {
        console.error('❌ Error loading commands:', error);
        logger.error(`Command Load Error: ${error.message}`);
    }
}

// ✅ Bot Error Handling
bot.catch((err, ctx) => {
    console.error(`❌ Error in bot: ${err}`);
    logger.error(`Bot Error: ${err.message}`);
    ctx.reply('⚠️ An error occurred. Please try again.');
});

// ✅ Start Bot
async function startBot() {
    await connectDB(); // Ensure MongoDB is connected before starting the bot
    loadCommands(); // Load all commands
    bot.launch()
        .then(() => {
            console.log('🚀 Bot is running!');
            logger.info('Bot started successfully');
        })
        .catch((err) => {
            console.error('❌ Bot launch error:', err);
            logger.error(`Bot Launch Error: ${err.message}`);
        });
}

// ✅ Graceful Stop Handling
process.on('SIGINT', () => {
    bot.stop('SIGINT');
    console.log('⚠️ Bot stopped gracefully (SIGINT)');
    process.exit(0);
});

process.on('SIGTERM', () => {
    bot.stop('SIGTERM');
    console.log('⚠️ Bot stopped gracefully (SIGTERM)');
    process.exit(0);
});

// Start the bot
startBot();
