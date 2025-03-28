module.exports = {
    getUserId: (ctx) => {
        return ctx.from ? ctx.from.id : null;
    },

    getChatId: (ctx) => {
        return ctx.chat ? ctx.chat.id : null;
    },

    getMessageId: (ctx) => {
        return ctx.message ? ctx.message.message_id : null;
    },

    getUsername: (ctx) => {
        return ctx.from && ctx.from.username ? `@${ctx.from.username}` : "Unknown";
    }
};
