module.exports = (bot) => {
  
  // 🔹 Start Command
  bot.command("start", (ctx) => {
    ctx.reply(
      `👋 *Welcome, ${ctx.from.first_name}!*  
I am your Group Management Bot 🤖.  
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
- /promote – Promote a user to admin  
- /demote – Demote an admin  

🔹 *General Commands:*  
- /start – Start the bot  
- /help – Show this message  
- /info – Get bot info  
- /rules – Show group rules  
- /report – Report a user to admins  

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

  // 🔹 Rules Command
  bot.command("rules", (ctx) => {
    ctx.reply(
      `📜 *Group Rules:*  
1️⃣ Be respectful to others.  
2️⃣ No spamming or flooding the chat.  
3️⃣ No hate speech or offensive content.  
4️⃣ Follow Telegram's terms of service.  
5️⃣ Admins have the final say.  

❗ Violating rules may lead to **warnings, mutes, or bans**.`,
      { parse_mode: "Markdown" }
    );
  });

  // 🔹 Report Command (Notifies admins)
  bot.command("report", (ctx) => {
    const repliedUser = ctx.message.reply_to_message?.from;
    if (!repliedUser) {
      return ctx.reply("⚠️ *Reply to a message to report a user.*", { parse_mode: "Markdown" });
    }

    ctx.reply(
      `🚨 *User Reported!*  
👤 *User:* [${repliedUser.first_name}](tg://user?id=${repliedUser.id})  
📢 *Reported by:* [${ctx.from.first_name}](tg://user?id=${ctx.from.id})  

🔔 *Admins, please take action!*`,
      { parse_mode: "Markdown" }
    );
  });

};
