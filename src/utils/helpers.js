const ms = require("ms");

// 📌 Convert Time (e.g., "10m" → 600000ms)
const parseTime = (timeStr) => {
  try {
    const timeMs = ms(timeStr);
    return timeMs || null;
  } catch {
    return null;
  }
};

// 📌 Format User Info
const formatUser = (user) => {
  return `[${user.first_name}](tg://user?id=${user.id})`;
};

// 📌 Get Reply Target (Returns user from replied message)
const getRepliedUser = (ctx) => {
  return ctx.message.reply_to_message ? ctx.message.reply_to_message.from : null;
};

// 📌 Send Error Message
const sendError = (ctx, msg) => {
  ctx.reply(`❌ *Error:* ${msg}`, { parse_mode: "Markdown" });
};

module.exports = { parseTime, formatUser, getRepliedUser, sendError };
