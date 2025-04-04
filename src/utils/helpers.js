import fs from 'fs';
import path from 'path';
import logger from './logger.js';

// Auto-clean temp folder periodically
export function autoCleanTemp(interval = 60 * 60 * 1000) {
  const tempPath = path.join(process.cwd(), 'temp');

  // Create the temp folder if it doesn't exist
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

  clean(); // Run cleanup once immediately
  setInterval(clean, interval);
  logger.info('Auto temp cleaner started.');
}

const { Markup } = require("telegraf");

// ✅ Format user information
function formatUser(user) {
    if (!user) return "Unknown User";
    const username = user.username ? `[@${user.username}](tg://user?id=${user.id})` : `[${user.first_name}](tg://user?id=${user.id})`;
    return `${username} (${user.id})`;
}

// ✅ Extract user ID from a message
function getUserId(ctx) {
    if (ctx.message.reply_to_message) {
        return ctx.message.reply_to_message.from.id;
    }
    const args = ctx.message.text.split(" ");
    if (args.length > 1 && !isNaN(args[1])) {
        return parseInt(args[1]);
    }
    return null;
}

// ✅ Validate if a user is an admin
async function isAdmin(ctx, userId) {
    try {
        const member = await ctx.getChatMember(userId);
        return ["administrator", "creator"].includes(member.status);
    } catch (error) {
        return false;
    }
}

// ✅ Anti-Abuse Filter
function containsBadWords(text, badWords) {
    return badWords.some(word => text.toLowerCase().includes(word));
}

// ✅ Link detection (to prevent spam/ads)
function containsLinks(text) {
    const linkRegex = /(https?:\/\/|www\.)\S+/gi;
    return linkRegex.test(text);
}

// ✅ Create an inline button
function createInlineButton(text, url) {
    return Markup.inlineKeyboard([Markup.button.url(text, url)]);
}

// ✅ Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ✅ Auto-delete messages
async function autoDelete(ctx, msg, delayMs = 5000) {
    await delay(delayMs);
    try {
        await ctx.deleteMessage(msg.message_id);
    } catch (error) {
        console.error("Failed to delete message:", error.message);
    }
}

module.exports = {
    formatUser,
    getUserId,
    isAdmin,
    containsBadWords,
    containsLinks,
    createInlineButton,
    delay,
    autoDelete
};
