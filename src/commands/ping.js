module.exports = (bot) => {
    bot.command('ping', async (ctx) => {
        try {
            const start = Date.now();
            await ctx.reply('🏓 Pong!');
            const end = Date.now();
            ctx.reply(`⏳ Response time: ${end - start}ms`);
        } catch (error) {
            console.error('❌ Error in ping command:', error);
            ctx.reply('⚠️ Failed to execute ping command.');
        }
    });
};
