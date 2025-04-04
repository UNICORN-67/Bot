module.exports = (bot) => {
  bot.command('groupinfo', async (ctx) => {
    try {
      const chat = ctx.chat;

      if (chat.type === 'private') {
        return ctx.reply('⚠️ This command only works in groups.');
      }

      const title = chat.title || 'N/A';
      const chatId = chat.id;
      const type = chat.type;
      const username = chat.username ? `@${chat.username}` : 'No Public Username';
      const inviteLink = chat.invite_link || `https://t.me/c/${String(chat.id).substring(4)}`;

      const info = `
*📌 Group Info*
• *Title:* _${title}_
• *Group ID:* \`${chatId}\`
• *Type:* _${type}_
• *Username:* _${username}_
• *Invite Link:* [Click Here](${inviteLink})
      `.trim();

      await ctx.reply(info, { parse_mode: 'Markdown', disable_web_page_preview: true });
    } catch (error) {
      console.error('Error in groupinfo command:', error);
      await ctx.reply('❌ Failed to fetch group information.');
    }
  });
};