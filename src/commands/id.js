module.exports = {
    id: async (ctx) => {
        try {
            const userId = ctx.from.id;
            const username = ctx.from.username ? `@${ctx.from.username}` : "No username";
            const message = `🆔 Your Telegram ID: \`${userId}\`\n👤 Username: ${username}`;
            
            await ctx.reply(message, { parse_mode: "Markdown" });
        } catch (error) {
            console.error("Error in ID command:", error);
            await ctx.reply("⚠️ An error occurred while fetching your ID.");
        }
    }
};
