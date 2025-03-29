const { Telegraf } = require('telegraf');
const isAdmin = require('../middlewares/isAdmin');
const logger = require('../utils/logger');

module.exports = (bot) => {
    const getUser = (ctx) => {
        if (ctx.message.reply_to_message) {
            return ctx.message.reply_to_message.from;
        } else {
            const username = ctx.message.text.split(' ')[1];
            if (!username) return null;
            return ctx.telegram.getChatMember(ctx.chat.id, username);
        }
    };

    bot.command('promote', async (ctx) => {
        try {
            if (!(await isAdmin(ctx))) return;
            const user = getUser(ctx);
            if (!user) return ctx.reply('Reply to a user or provide a username to promote.');
            await ctx.telegram.promoteChatMember(ctx.chat.id, user.id, {
                can_manage_chat: true,
                can_delete_messages: true,
                can_restrict_members: true,
                can_promote_members: false
            });
            ctx.reply(`Promoted ${user.first_name || username} to admin.`);
            logger.info(`User ${user.id} promoted in chat ${ctx.chat.id}`);
        } catch (error) {
            logger.error("Error in promote command:", error);
            ctx.reply("An error occurred while promoting.");
        }
    });

    bot.command('demote', async (ctx) => {
        try {
            if (!(await isAdmin(ctx))) return;
            const user = getUser(ctx);
            if (!user) return ctx.reply('Reply to a user or provide a username to demote.');
            await ctx.telegram.promoteChatMember(ctx.chat.id, user.id, {
                can_manage_chat: false,
                can_delete_messages: false,
                can_restrict_members: false,
                can_promote_members: false
            });
            ctx.reply(`Demoted ${user.first_name || username}.`);
            logger.info(`User ${user.id} demoted in chat ${ctx.chat.id}`);
        } catch (error) {
            logger.error("Error in demote command:", error);
            ctx.reply("An error occurred while demoting.");
        }
    });

    bot.command('mute', async (ctx) => {
        try {
            if (!(await isAdmin(ctx))) return;
            const user = getUser(ctx);
            if (!user) return ctx.reply('Reply to a user or provide a username to mute.');
            await ctx.telegram.restrictChatMember(ctx.chat.id, user.id, {
                permissions: { can_send_messages: false }
            });
            ctx.reply(`${user.first_name || username} has been muted.`);
            logger.info(`User ${user.id} muted in chat ${ctx.chat.id}`);
        } catch (error) {
            logger.error("Error in mute command:", error);
            ctx.reply("An error occurred while muting.");
        }
    });

    bot.command('unmute', async (ctx) => {
        try {
            if (!(await isAdmin(ctx))) return;
            const user = getUser(ctx);
            if (!user) return ctx.reply('Reply to a user or provide a username to unmute.');
            await ctx.telegram.restrictChatMember(ctx.chat.id, user.id, {
                permissions: { can_send_messages: true }
            });
            ctx.reply(`${user.first_name || username} has been unmuted.`);
            logger.info(`User ${user.id} unmuted in chat ${ctx.chat.id}`);
        } catch (error) {
            logger.error("Error in unmute command:", error);
            ctx.reply("An error occurred while unmuting.");
        }
    });

    bot.command('kick', async (ctx) => {
        try {
            if (!(await isAdmin(ctx))) return;
            const user = getUser(ctx);
            if (!user) return ctx.reply('Reply to a user or provide a username to kick.');
            await ctx.telegram.kickChatMember(ctx.chat.id, user.id);
            ctx.reply(`${user.first_name || username} has been kicked.`);
            logger.info(`User ${user.id} kicked from chat ${ctx.chat.id}`);
        } catch (error) {
            logger.error("Error in kick command:", error);
            ctx.reply("An error occurred while kicking.");
        }
    });

    bot.command('ban', async (ctx) => {
        try {
            if (!(await isAdmin(ctx))) return;
            const user = getUser(ctx);
            if (!user) return ctx.reply('Reply to a user or provide a username to ban.');
            await ctx.telegram.banChatMember(ctx.chat.id, user.id);
            ctx.reply(`${user.first_name || username} has been banned.`);
            logger.info(`User ${user.id} banned from chat ${ctx.chat.id}`);
        } catch (error) {
            logger.error("Error in ban command:", error);
            ctx.reply("An error occurred while banning.");
        }
    });

    bot.command('unban', async (ctx) => {
        try {
            if (!(await isAdmin(ctx))) return;
            const user = getUser(ctx);
            if (!user) return ctx.reply('Reply to a user or provide a username to unban.');
            await ctx.telegram.unbanChatMember(ctx.chat.id, user.id);
            ctx.reply(`${user.first_name || username} has been unbanned.`);
            logger.info(`User ${user.id} unbanned in chat ${ctx.chat.id}`);
        } catch (error) {
            logger.error("Error in unban command:", error);
            ctx.reply("An error occurred while unbanning.");
        }
    });
};
