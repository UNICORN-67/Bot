const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// Format user info
function formatUser(user) {
  return `${user.first_name}${user.last_name ? ' ' + user.last_name : ''} (${user.username ? '@' + user.username : user.id})`;
}

// Get user ID
function getUserId(ctx) {
  return ctx.from?.id || null;
}

// Check admin status
function isAdmin(member) {
  return ['creator', 'administrator'].includes(member.status);
}

// Basic bad word filter
function containsBadWords(text, badWordsList) {
  if (!text) return false;
  const textLower = text.toLowerCase();
  return badWordsList.some(word => textLower.includes(word));
}

// Check for links
function containsLinks(text) {
  const linkRegex = /(?:https?:\/\/|t\.me\/|telegram\.me\/|www\.)\S+/gi;
  return linkRegex.test(text);
}

// Inline button builder
function createInlineButton(text, callbackData) {
  return {
    reply_markup: {
      inline_keyboard: [[{ text, callback_data: callbackData }]]
    }
  };
}

// Delay execution
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Auto-delete a message
async function autoDelete(ctx, delayMs = 5000) {
  if (ctx?.message?.message_id) {
    setTimeout(() => {
      ctx.deleteMessage(ctx.message.message_id).catch(() => {});
    }, delayMs);
  }
}

// Auto-clean temp folder
function autoCleanTemp(interval = 60 * 60 * 1000) {
  const tempPath = path.join(process.cwd(), 'temp');

  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath, { recursive: true });
    logger.info('Temp folder created.');
  }

  const clean = () => {
    fs.readdir(tempPath, (err, files) => {
      if (err) {
        logger.error('Error reading temp folder:', err);
        return;
      }

      files.forEach(file => {
        const filePath = path.join(tempPath, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            logger.warn(`Failed to delete temp file: ${file}`, err);
          } else {
            logger.info(`Deleted temp file: ${file}`);
          }
        });
      });
    });
  };

  clean();
  setInterval(clean, interval);
  logger.info('Auto temp cleaner started.');
}

module.exports = {
  formatUser,
  getUserId,
  isAdmin,
  containsBadWords,
  containsLinks,
  createInlineButton,
  delay,
  autoDelete,
  autoCleanTemp
};