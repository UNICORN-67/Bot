module.exports = (bot) => {
  bot.command('userinfo', async (ctx) => {
    try {
      const reply = ctx.message.reply_to_message;
      const user = reply ? reply.from : ctx.from;

      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      const username = user.username ? `@${user.username}` : 'No Username';
      const userId = user.id;
      const isBot = user.is_bot ? 'Yes' : 'No';
      const langCode = user.language_code || 'Unknown';

      const info = `
*👤 User Info*
• *Full Name:* _${fullName}_
• *Username:* _${username}_
• *User ID:* \`${userId}\`
• *Is Bot:* _${isBot}_
• *Language:* _${langCode}_
      `.trim();

      await ctx.reply(info, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error in userinfo command:', error);
      await ctx.reply('❌ Failed to get user information.');
    }
  });
};