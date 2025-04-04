const { containsBadWords } = require('../utils/badWords');
const { isNSFWSticker, extractVideoFrameNSFW } = require('../utils/nsfwAI');
const logger = require('../utils/logger');

module.exports = async (ctx, next) => {
  try {
    const message = ctx.message || ctx.update?.message;
    if (!message) return next();

    const userId = message.from?.id;
    const chatId = message.chat?.id;

    // 1. Text or caption
    const text = message.text || message.caption;
    if (text && containsBadWords(text)) {
      await ctx.deleteMessage();
      logger.warn(`Deleted NSFW text from ${userId} in ${chatId}`);
      return;
    }

    // 2. Stickers
    if (message.sticker) {
      const isAnimated = message.sticker.is_animated || message.sticker.is_video;
      const isNSFW = isAnimated
        ? await extractVideoFrameNSFW(message.sticker.file_id)
        : await isNSFWSticker(message.sticker);

      if (isNSFW) {
        await ctx.deleteMessage();
        logger.warn(`Deleted NSFW sticker from ${userId} in ${chatId}`);
        return;
      }
    }

    // 3. Videos (optional future logic can be added here)

    await next();
  } catch (error) {
    logger.error('NSFW Middleware Error:', error);
    await next(); // Continue to avoid bot crash
  }
};