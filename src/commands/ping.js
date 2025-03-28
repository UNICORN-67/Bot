module.exports = {
    ping: async (ctx) => {
        const startTime = Date.now();
        await ctx.reply("🏓 Pong! Checking latency...");
        const latency = Date.now() - startTime;
        ctx.reply(`✅ Bot is online!\n⏳ Response Time: ${latency}ms`);
    },
};
