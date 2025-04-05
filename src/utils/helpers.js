const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const { badwords } = require('./abusefilter');

// Format user info nicely
function formatUser(user) {
  return `${user.first_name || ''} ${user.last_name || ''} (${user.username ? '@' + user.username : 'No Username'}) [${user.id}]`;
}

// Get user ID from message
function getUserId(ctx) {
  return ctx.message?.reply_to_message?.from?.id || ctx.message?.from?.id;
}

// Check if user is admin
async function isAdmin(ctx, userId) {
  const member = await ctx.getChatMember(userId);
  return ['creator', 'administrator'].includes(member.status);
}

// Check for bad words
function containsBadWords(text) {
  return badwords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(text));
}

// Check for links
function containsLinks(text) {
  const linkRegex = /(https?:\/\/[^\s]+|t\.me\/\S+|telegram\.me\/\S+)/gi;
  return linkRegex.test(text);
}

// Create inline button
function createInlineButton(label, url) {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: label, url }]],
    },
  };
}

// Delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Auto delete message
async function autoDelete(ctx, seconds = 10) {
  if (!ctx.message) return;
  setTimeout(() => {
    ctx.deleteMessage(ctx.message.message_id).catch(() => {});
  }, seconds * 1000);
}

// Auto-clean temp folder
function autoCleanTemp(folderPath = path.join(__dirname, '../temp'), intervalMinutes = 30) {
  setInterval(() => {
    fs.readdir(folderPath, (err, files) => {
      if (err) return;
      files.forEach(file => {
        const filePath = path.join(folderPath, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          const now = Date.now();
          if (now - stats.mtimeMs > 60 * 60 * 1000) {
            fs.unlink(filePath, () => {});
          }
        });
      });
    });
  }, intervalMinutes * 60 * 1000);
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