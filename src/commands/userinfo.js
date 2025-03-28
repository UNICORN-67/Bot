module.exports = {
    userinfo: async (ctx) => {
        try {
            const user = ctx.message.reply_to_message ? ctx.message.reply_to_message.from : ctx.from;
            const userId = user.id;
            const username = user.username ? `@${user.username}` : "No username";
            const firstName = user.first_name || "No first name";
            const lastName = user.last_name ? user.last_name : "No last name";
            const isBot = user.is_bot ? "Yes" : "No";

            const message = `👤 **User Info**:
🆔 **User ID:** \`${userId}\`
📛 **Username:** ${username}
📝 **First Name:** ${firstName}
📝 **Last Name:** ${lastName}
🤖 **Bot:** ${isBot}`;

            await ctx.reply(message, { parse_mode: "Markdown" });
        } catch (error) {
            console.error("Error in userinfo command:", error);
            await ctx.reply("⚠️ An error occurred while fetching user info.");
        }
    }
};
