module.exports = (bot) => {
    bot.command('id', async (ctx) => {
        try {
            const chat = ctx.chat;
            const user = ctx.message.reply_to_message ? ctx.message.reply_to_message.from : ctx.from;

            // ✅ Escape special characters for MarkdownV2 while keeping bold & italic formatting
            const escapeMD = (text) => {
                return text ? text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1') : 'N/A';
            };

            // ✅ Properly formatted message with bold & italic
            const message = `🆔 *User ID:* \`${user.id}\`\n`
                + `👤 *Name:* _${escapeMD(user.first_name)} ${user.last_name ? escapeMD(user.last_name) : ''}_\n`
                + `📛 *Username:* ${user.username ? `@${escapeMD(user.username)}` : '_N/A_'}\n`
                + `👥 *Chat ID:* \`${chat.id}\``;

            await ctx.replyWithMarkdownV2(message);
        } catch (error) {
            console.error('❌ Error in ID command:', error);
            ctx.reply('⚠️ Error fetching ID.');
        }
    });
};
