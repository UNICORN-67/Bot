module.exports = async (ctx, next) => {
    if (!ctx.message || !ctx.chat || !ctx.from) return next();

    try {
        const chatMember = await ctx.getChatMember(ctx.from.id);

        if (
            chatMember.status === 'administrator' ||
            chatMember.status === 'creator'
        ) {
            return next(); // User is admin/mod, allow command execution
        } else {
            await ctx.reply(`❌ You must be an admin to use this command, ${ctx.from.first_name}.`);
        }
    } catch (err) {
        console.error('Error checking permissions:', err);
    }
};
