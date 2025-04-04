module.exports = (bot) => {
  bot.command('purge', async (ctx) => {
    try {
      const reply = ctx.message.reply_to_message;

      if (!reply) {
        return ctx.reply('⚠️ Reply to a message to start purging from there.');
      }

      const chatId = ctx.chat.id;
      const startId = reply.message_id;
      const endId = ctx.message.message_id;

      const isAdmin = await ctx.getChatMember(ctx.from.id);
      if (!['creator', 'administrator'].includes(isAdmin.status)) {
        return ctx.reply('❌ You must be an admin to use this command.');
      }

      for (let i = startId; i < endId; i++) {
        try {
          await ctx.deleteMessage(i);
        } catch (err) {
          console.log(`Failed to delete message ${i}:`, err.message);
        }
      }

      await ctx.deleteMessage(ctx.message.message_id); // delete the command
    } catch (error) {
      console.error('Error in purge command:', error);
      await ctx.reply('❌ Failed to purge messages.');
    }
  });
};