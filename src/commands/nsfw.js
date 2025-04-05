const { detectNSFW } = require('../utils/nsfwai');
const fs = require('fs');
const path = require('path');
const { downloadMedia } = require('../utils/helpers');

module.exports = {
  name: 'nsfw',
  description: 'Scan image/video/sticker for NSFW content using AI',
  async execute(bot, msg) {
    const reply = msg.reply_to_message;

    if (!reply || (!reply.photo && !reply.video && !reply.sticker)) {
      return bot.sendMessage(msg.chat.id, 'Please reply to an image, video, or sticker to scan.');
    }

    try {
      const tempFilePath = await downloadMedia(bot, reply);
      if (!tempFilePath) return;

      const isNSFW = await detectNSFW(tempFilePath);

      if (isNSFW) {
        await bot.deleteMessage(msg.chat.id, reply.message_id);
        await bot.sendMessage(msg.chat.id, 'NSFW content detected and removed.');
      } else {
        await bot.sendMessage(msg.chat.id, 'Content is clean.');
      }

      fs.unlinkSync(tempFilePath);
    } catch (err) {
      console.error('NSFW Command Error:', err);
      bot.sendMessage(msg.chat.id, 'An error occurred during NSFW detection.');
    }
  }
};