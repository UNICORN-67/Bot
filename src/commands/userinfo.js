module.exports = (bot) => {
    bot.command('userinfo', async (ctx) => {
        try {
            const user = ctx.message.reply_to_message ? ctx.message.reply_to_message.from : ctx.from;
            const chat = ctx.chat;
            
            let response = `👤 *User Info:*
`;
            response += `🆔 *User ID:* \`${user.id}\`\n`;
            if (user.username) {
                response += `🌐 *Username:* @${user.username}\n`;
            }
            response += `👤 *First Name:* ${user.first_name}\n`;
            if (user.last_name) {
                response += `📝 *Last Name:* ${user.last_name}\n`;
            }
            if (user.language_code) {
                response += `🌍 *Language Code:* ${user.language_code}\n`;
            }
            response += `📌 *Chat ID:* \`${chat.id}\`\n`;
            if (chat.type !== 'private') {
                response += `🏷 *Chat Title:* ${chat.title}\n`;
            }
            
            ctx.reply(response, { parse_mode: 'MarkdownV2' });
        } catch (error) {
            console.error('Error in userinfo command:', error);
            ctx.reply('❌ An error occurred while fetching user information.');
        }
    });
};
