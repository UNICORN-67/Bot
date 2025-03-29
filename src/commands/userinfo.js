module.exports = (bot) => {
    bot.command('userinfo', async (ctx) => {
        try {
            const chat = ctx.chat;
            const user = ctx.from;

            // Restrict to groups only
            if (chat.type === 'private') {
                return ctx.reply('❌ This command can only be used in groups.');
            }

            // Escape special characters for Telegram MarkdownV2
            const escapeMD = (text) => text ? text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1') : 'N/A';

            const message = `👤 *User Info*
🆔 *ID:* \`${user.id}\`
👤 *Name:* ${escapeMD(user.first_name)} ${user.last_name ? escapeMD(user.last_name) : ''}
📛 *Username:* ${user.username ? `@${escapeMD(user.username)}` : 'N/A'}
🌍 *Language:* ${user.language_code || 'Unknown'}`;

            await ctx.replyWithMarkdownV2(message);
        } catch (error) {
            console.error('❌ Error in userinfo command:', error);
            ctx.reply('⚠️ Error fetching user info.');
        }
    });
};
