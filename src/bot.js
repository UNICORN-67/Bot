import { Telegraf } from 'telegraf';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

import config from './config/config.js';
import logger from './utils/logger.js';
import { autoCleanTemp } from './utils/helpers.js';
import loadCommands from './utils/commandLoader.js';

// Middlewares
import abuseFilter from './middleware/abuse.js';
// import spamProtect from './middleware/spam.js';//
import permissions from './middleware/permissions.js';
import nsfwScan from './middleware/nsfw.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure temp folder exists
fs.ensureDirSync(path.join(__dirname, '../temp'));

// Auto clean temp periodically
autoCleanTemp();

// Initialize bot
const bot = new Telegraf(config.BOT_TOKEN);

// MongoDB Connection
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => logger.info('✅ MongoDB connected'))
  .catch((err) => logger.error('❌ MongoDB connection failed:', err));

// Apply Middlewares
bot.use(async (ctx, next) => {
  try {
    await permissions(ctx, next);
  } catch (err) {
    logger.error('Permission error:', err);
  }
});

// bot.use(spamProtect); //
bot.use(abuseFilter);
bot.use(nsfwScan);

// Load all commands
loadCommands(bot);

// Error handler
bot.catch((err, ctx) => {
  logger.error(`Error in ${ctx.updateType}:`, err);
});

// Launch bot
bot.launch().then(() => {
  logger.info('🚀 Bot started successfully');
}).catch((err) => {
  logger.error('❌ Failed to launch bot:', err);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));