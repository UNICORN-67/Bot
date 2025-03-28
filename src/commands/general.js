module.exports = (bot) => {
  
  // 🔹 Start Command
  bot.command("start", (ctx) => {
    ctx.reply(
      `👋 *Welcome ${ctx.from.first_name}!*  
I am a Group Management Bot 🤖.  
Use /help to see available commands.`,
      { parse_mode: "Markdown" }
    );
  });

  // 🔹 Help Command
  bot.command("help", (ctx) => {
    ctx.reply(
      `📌 *Available Commands:*  
      
🔹 *Admin Commands:*  
- /ban – Ban a user  
- /unban – Unban a user  
- /kick – Kick a user  
- /mute – Mute a user  
- /unmute – Unmute a user  
- /promote – Promote to admin  
- /demote – Demote admin  

🔹 *General Commands:*  
- /start – Start the bot  
- /help – Show this message  
- /info – Get bot info  

🛠️ *Admin commands only work for group admins!*`,
      { parse_mode: "Markdown" }
    );
  });

  // 🔹 Info Command
  bot.command("info", (ctx) => {
    ctx.reply(
      `🤖 *Bot Name:* Telegram Group Bot  
🚀 *Version:* 1.0.0  
👨‍💻 *Developer:* You  
📚 *Commands:* Use /help to see all available commands.`
    );
  });

};
