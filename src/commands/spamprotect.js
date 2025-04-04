const userSpamMap = new Map();
const SPAM_TIME_LIMIT = 4000; // 4 seconds
const SPAM_MAX_COUNT = 4;     // max 4 msgs in SPAM_TIME_LIMIT

module.exports = async (ctx, next) => {
  try {
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;

    if (!userId || !chatId) return next();

    const key = `${chatId}:${userId}`;
    const now = Date.now();

    if (!userSpamMap.has(key)) {
      userSpamMap.set(key, []);
    }

    const timestamps = userSpamMap.get(key);
    timestamps.push(now);

    // keep only recent messages in limit window
    const recentTimestamps = timestamps.filter(ts => now - ts < SPAM_TIME_LIMIT);
    userSpamMap.set(key, recentTimestamps);

    if (recentTimestamps.length > SPAM_MAX_COUNT) {
      // delete the message and warn the user
      await ctx.deleteMessage();
      await ctx.replyWithMarkdown(`⚠️ *Spam detected!* <a href="tg://user?id=${userId}">${ctx.from.first_name}</a>, please slow down.`, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });
      return;
    }

    await next();

  } catch (error) {
    console.error('Spam Protection Error:', error);
    await next();
  }
};