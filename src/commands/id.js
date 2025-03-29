module.exports = (bot) => {
    bot.command('id', async (ctx) => {
        try {
            const user = ctx.message.reply_to_message ? ctx.message.reply_to_message.from : ctx.from;
            const chat = ctx.chat;
            let response = `👤 *User ID:* \`${user.id}\`
📌 *Chat ID:* \`${chat.id}\``;
            
            if (user.username) {
                response += `\n🌐 *Username:* @${user.username}`;
            }
            if (chat.type !== 'private') {
                response += `\n🏷 *Chat Title:* ${chat.title}`;
            }
            
            ctx.reply(response, { parse_mode: 'MarkdownV2' });
        } catch (error) {
            console.error('Error in ID command:', error);
            ctx.reply('❌ An error occurred while fetching the ID.');
        }
    });
};
