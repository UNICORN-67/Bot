module.exports = (bot) => {
    bot.command('userinfo', async (ctx) => {
        try {
            const user = ctx.from;
            const chat = ctx.chat;

            // ✅ Escape Telegram MarkdownV2 special characters
            const escapeMarkdownV2 = (text) => {
                return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
            };

            const message = `👤 *User Info*:
🆔 ID: \`${user.id}\`
👤 Name: ${escapeMarkdownV2(user.first_name)} ${user.last_name ? escapeMarkdownV2(user.last_name) : ''}
📛 Username: ${user.username ? `@${escapeMarkdownV2(user.username)}` : 'N/A'}
🌍 Language: ${user.language_code || 'Unknown'}
💬 Chat Type: ${chat.type}`;

            await ctx.replyWithMarkdownV2(message);
        } catch (error) {
            console.error('❌ Error in userinfo command:', error);
            ctx.reply('⚠️ An error occurred while fetching user info.');
        }
    });
};
