const badWords = require('../utils/badwords'); // List of abusive words

module.exports = async (ctx, next) => {
    if (!ctx.message || !ctx.message.text) return next();

    const messageText = ctx.message.text.toLowerCase();
    const hasAbuse = badWords.some(word => messageText.includes(word));

    if (hasAbuse) {
        try {
            await ctx.deleteMessage();
            await ctx.reply(`🚫 Abusive language is not allowed, ${ctx.from.first_name}.`);
        } catch (err) {
            console.error('Error deleting abusive message:', err);
        }
    } else {
        return next();
    }
};
