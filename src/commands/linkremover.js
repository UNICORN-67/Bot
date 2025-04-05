const { isAdmin } = require('../utils/helpers');
const { containsLinks } = require('../utils/abusefilter');

module.exports = {
  name: 'linkremover',
  description: 'Deletes messages containing links (non-admins only)',
  async execute(bot, msg) {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;

      const admin = await isAdmin(bot, chatId, userId);
      if (admin) return;

      if (containsLinks(msg.text || '')) {
        await bot.deleteMessage(chatId, msg.message_id);
        await bot.sendMessage(chatId, 'Link detected and removed.');
      }
    } catch (error) {
      console.error('Link Remover Error:', error);
    }
  }
};