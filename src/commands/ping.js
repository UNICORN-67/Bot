const { performance } = require('perf_hooks');
const os = require('os');

module.exports = (bot) => {
  bot.command('ping', async (ctx) => {
    try {
      const start = performance.now();
      const message = await ctx.reply('🏓 Pinging...');
      const end = performance.now();

      const latency = Math.round(end - start);
      const uptime = process.uptime(); // in seconds
      const uptimeStr = new Date(uptime * 1000).toISOString().substr(11, 8); // HH:MM:SS

      const response = `
*🏓 Pong!*
• *Latency:* \`${latency}ms\`
• *Uptime:* \`${uptimeStr}\`
• *CPU:* \`${os.cpus()[0].model}\`
• *Platform:* \`${os.platform()}\`
      `.trim();

      await message.editText(response, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('Ping command error:', err);
      ctx.reply('❌ Ping failed.');
    }
  });
};