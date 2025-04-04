module.exports = (bot) => {
  bot.command('id', async (ctx) => {
    try {
      const reply = ctx.message.reply_to_message;
      const user = reply ? reply.from : ctx.from;

      const userId = user.id;
      const username = user.username ? `@${user.username}` : 'No Username';
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();

      const idInfo = `
*User Info*
• *Full Name:* _${fullName}_
• *Username:* _${username}_
• *User ID:* \`${userId}\`
      `.trim();

      await ctx.reply(idInfo, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('Error in ID command:', err.message);
      await ctx.reply('❌ Failed to fetch user ID.');
    }
  });
};