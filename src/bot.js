const fs = require('fs');
const path = require('path');
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const config = require('./config/config');
const abuseFilter = require('./middleware/abuse');
const spamProtect = require('./middleware/spam');
const permissions = require('./middleware/permissions');
const nsfwCheck = require('./middleware/nsfw');
const logger = require('./utils/logger');

const bot = new Telegraf(config.BOT_TOKEN);

// ===== MongoDB Connection =====
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  logger.info('MongoDB connected');
}).catch(err => {
  logger.error('MongoDB connection error:', err);
});

// ===== Temp Folder Setup =====
const tempPath = path.join(__dirname, 'temp');
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
  logger.info('Temp folder created');
} else {
  fs.readdir(tempPath, (err, files) => {
    if (!err) {
      files.forEach(file => fs.unlink(path.join(tempPath, file), () => {}));
      logger.info('Temp folder cleaned on startup');
    }
  });
}
setInterval(() => {
  fs.readdir(tempPath, (err, files) => {
    if (!err) {
      files.forEach(file => fs.unlink(path.join(tempPath, file), () => {}));
      logger.info('Temp folder auto-cleaned');
    }
  });
}, 10 * 60 * 1000);

// ===== Middleware Setup =====
bot.use(abuseFilter);
bot.use(spamProtect);
bot.use(permissions);
bot.use(nsfwCheck);

// ===== Auto Load Commands =====
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(file => {
  const command = require(path.join(commandsPath, file));
  if (command.name && typeof command.execute === 'function') {
    bot.command(command.name, async (ctx) => {
      try {
        await command.execute(ctx);
      } catch (err) {
        logger.error(`Error in command /${command.name}:`, err);
        ctx.reply('Something went wrong.');
      }
    });
  }
});

// ===== Start Bot =====
bot.launch()
  .then(() => logger.info('Bot launched successfully'))
  .catch(err => logger.error('Bot launch error:', err));