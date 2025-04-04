const { isAdmin } = require('../middleware/permissions');
const { sendLog } = require('../utils/logger');

module.exports = (bot) => {
  // Utility to get user from mention, reply, or ID
  const getTargetUser = (ctx) => {
    if (ctx.message.reply_to_message) return ctx.message.reply_to_message.from;
    const arg = ctx.message.text.split(' ')[1];
    if (!arg) return null;
    if (arg.startsWith('@')) return { username: arg };
    if (!isNaN(arg)) return { id: parseInt(arg) };
    return null;
  };

  bot.command('ban', isAdmin, async (ctx) => {
    const user = getTargetUser(ctx);
    if (!user) return ctx.reply('⚠️ Specify a user to ban.');

    try {
      await ctx.banChatMember(user.id || user.username);
      await ctx.reply('✅ User banned.');
      sendLog(`User Banned: ${user.id || user.username}`);
    } catch (err) {
      ctx.reply('❌ Failed to ban user.');
    }
  });

  bot.command('unban', isAdmin, async (ctx) => {
    const user = getTargetUser(ctx);
    if (!user) return ctx.reply('⚠️ Specify a user to unban.');

    try {
      await ctx.unbanChatMember(user.id || user.username);
      await ctx.reply('✅ User unbanned.');
      sendLog(`User Unbanned: ${user.id || user.username}`);
    } catch {
      ctx.reply('❌ Failed to unban user.');
    }
  });

  bot.command('kick', isAdmin, async (ctx) => {
    const user = getTargetUser(ctx);
    if (!user) return ctx.reply('⚠️ Specify a user to kick.');

    try {
      await ctx.kickChatMember(user.id || user.username);
      await ctx.unbanChatMember(user.id || user.username); // allow them to rejoin
      await ctx.reply('✅ User kicked.');
      sendLog(`User Kicked: ${user.id || user.username}`);
    } catch {
      ctx.reply('❌ Failed to kick user.');
    }
  });

  bot.command('mute', isAdmin, async (ctx) => {
    const user = getTargetUser(ctx);
    if (!user) return ctx.reply('⚠️ Specify a user to mute.');

    try {
      await ctx.restrictChatMember(user.id || user.username, {
        permissions: { can_send_messages: false },
      });
      await ctx.reply('🔇 User muted.');
      sendLog(`User Muted: ${user.id || user.username}`);
    } catch {
      ctx.reply('❌ Failed to mute user.');
    }
  });

  bot.command('unmute', isAdmin, async (ctx) => {
    const user = getTargetUser(ctx);
    if (!user) return ctx.reply('⚠️ Specify a user to unmute.');

    try {
      await ctx.restrictChatMember(user.id || user.username, {
        permissions: {
          can_send_messages: true,
          can_send_media_messages: true,
          can_send_other_messages: true,
          can_add_web_page_previews: true,
        },
      });
      await ctx.reply('🔊 User unmuted.');
      sendLog(`User Unmuted: ${user.id || user.username}`);
    } catch {
      ctx.reply('❌ Failed to unmute user.');
    }
  });

  bot.command('promote', isAdmin, async (ctx) => {
    const user = getTargetUser(ctx);
    if (!user) return ctx.reply('⚠️ Specify a user to promote.');

    try {
      await ctx.promoteChatMember(user.id || user.username, {
        can_change_info: true,
        can_delete_messages: true,
        can_invite_users: true,
        can_restrict_members: true,
        can_pin_messages: true,
        can_promote_members: false,
      });
      await ctx.reply('✅ User promoted to admin.');
      sendLog(`User Promoted: ${user.id || user.username}`);
    } catch {
      ctx.reply('❌ Failed to promote user.');
    }
  });

  bot.command('demote', isAdmin, async (ctx) => {
    const user = getTargetUser(ctx);
    if (!user) return ctx.reply('⚠️ Specify a user to demote.');

    try {
      await ctx.promoteChatMember(user.id || user.username, {
        can_change_info: false,
        can_delete_messages: false,
        can_invite_users: false,
        can_restrict_members: false,
        can_pin_messages: false,
        can_promote_members: false,
      });
      await ctx.reply('✅ User demoted from admin.');
      sendLog(`User Demoted: ${user.id || user.username}`);
    } catch {
      ctx.reply('❌ Failed to demote user.');
    }
  });
};