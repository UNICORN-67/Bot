module.exports = (bot) => {
    bot.command('userinfo', async (ctx) => {
        try {
            const chat = ctx.chat;

            // Ensure command works only in groups
            if (!['group', 'supergroup'].includes(chat.type)) {
                return ctx.reply('❌ This command can only be used in groups.');
            }

            // Determine user info (replied user or command sender)
            const user = ctx.message.reply_to_message ? ctx.message.reply_to_message.from : ctx.from;

            // ✅ Properly escape special characters for MarkdownV2
            const escapeMD = (text) => {
                return text ? text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&') : 'N/A';
            };

            // ✅ Use `ctx.replyWithMarkdownV2` safely
            const message = `👤 *User Info*\n`
                + `🆔 *ID:* \`${user.id}\`\n`
                + `👤 *Name:* ${escapeMD(user.first_name)} ${user.last_name ? escapeMD(user.last_name) : ''}\n`
                + `📛 *Username:* ${user.username ? `@${escapeMD(user.username)}` : 'N/A'}\n`
                + `🌍 *Language:* ${user.language_code || 'Unknown'}`;

            await ctx.replyWithMarkdownV2(message);
        } catch (error) {
            console.error('❌ Error in userinfo command:', error);
            ctx.reply('⚠️ Error fetching user info.');
        }
    });
};
