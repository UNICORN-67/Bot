const { addStickerToSet, createNewStickerSet } = require('../utils/stickerHelper');

module.exports = (bot) => {
  bot.command('kang', async (ctx) => {
    try {
      const reply = ctx.message.reply_to_message;

      if (!reply || !reply.sticker) {
        return ctx.reply('⚠️ *Reply to a sticker to kang it.*', { parse_mode: 'Markdown' });
      }

      const userId = ctx.from.id;
      const username = ctx.from.username || ctx.from.first_name.toLowerCase().replace(/\s+/g, '');
      const sticker = reply.sticker;

      const packName = `kang_by_${bot.botInfo.username}_${userId}`;
      const packTitle = `${ctx.from.first_name}'s Kang Pack`;

      const emoji = sticker.emoji || '😄';

      try {
        await addStickerToSet(ctx, userId, packName, sticker, emoji);
        await ctx.reply(`✅ *Sticker added to your pack!* [View Pack](https://t.me/addstickers/${packName})`, {
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        });
      } catch (err) {
        if (err.response && err.response.description.includes("STICKERSET_INVALID")) {
          await createNewStickerSet(ctx, userId, packName, packTitle, sticker, emoji);
          await ctx.reply(`✨ *New sticker pack created!* [Open Pack](https://t.me/addstickers/${packName})`, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true
          });
        } else {
          console.error('Kang error:', err);
          await ctx.reply('❌ Failed to kang the sticker.');
        }
      }

    } catch (error) {
      console.error('Kang Command Error:', error);
      await ctx.reply('❌ Unexpected error occurred during kang.');
    }
  });
};