module.exports = {
    getUserInfo: (ctx) => {
        if (!ctx.from) return null;

        return {
            id: ctx.from.id,
            username: ctx.from.username ? `@${ctx.from.username}` : "No Username",
            firstName: ctx.from.first_name || "No First Name",
            lastName: ctx.from.last_name || "No Last Name",
            isBot: ctx.from.is_bot,
            chatType: ctx.chat ? ctx.chat.type : "Unknown",
        };
    },
};
