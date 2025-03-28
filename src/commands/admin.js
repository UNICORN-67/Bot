const isAdmin = require("../middleware/isAdmin");
const logAction = require("../utils/logger");

module.exports = (bot) => {
  
  // 🔹 Ban a user
  bot.command("ban", isAdmin, async (ctx) => {
    try {
      const repliedUser = ctx.message.reply_to_message?.from;
      if (!repliedUser) return ctx.reply("⚠️ Reply to a user to ban.");

      await ctx.telegram.kickChatMember(ctx.chat.id, repliedUser.id);
      ctx.reply(`🚫 Banned ${repliedUser.first_name}.`);
      await logAction("ban", repliedUser, ctx.from, ctx.chat);
    } catch (err) {
      console.error("❌ Ban Command Error:", err);
      ctx.reply("❌ Failed to ban user. Please try again.");
    }
  });

  // 🔹 Unban a user
  bot.command("unban", isAdmin, async (ctx) => {
    try {
      const repliedUser = ctx.message.reply_to_message?.from;
      if (!repliedUser) return ctx.reply("⚠️ Reply to a user to unban.");

      await ctx.telegram.unbanChatMember(ctx.chat.id, repliedUser.id);
      ctx.reply(`✅ Unbanned ${repliedUser.first_name}.`);
      await logAction("unban", repliedUser, ctx.from, ctx.chat);
    } catch (err) {
      console.error("❌ Unban Command Error:", err);
      ctx.reply("❌ Failed to unban user. Please try again.");
    }
  });

  // 🔹 Kick a user (Temporary Ban)
  bot.command("kick", isAdmin, async (ctx) => {
    try {
      const repliedUser = ctx.message.reply_to_message?.from;
      if (!repliedUser) return ctx.reply("⚠️ Reply to a user to kick.");

      await ctx.telegram.kickChatMember(ctx.chat.id, repliedUser.id);
      await ctx.telegram.unbanChatMember(ctx.chat.id, repliedUser.id);
      ctx.reply(`👢 Kicked ${repliedUser.first_name}.`);
      await logAction("kick", repliedUser, ctx.from, ctx.chat);
    } catch (err) {
      console.error("❌ Kick Command Error:", err);
      ctx.reply("❌ Failed to kick user. Please try again.");
    }
  });

  // 🔹 Mute a user (Restrict from sending messages)
  bot.command("mute", isAdmin, async (ctx) => {
    try {
      const repliedUser = ctx.message.reply_to_message?.from;
      if (!repliedUser) return ctx.reply("⚠️ Reply to a user to mute.");

      await ctx.telegram.restrictChatMember(ctx.chat.id, repliedUser.id, {
        can_send_messages: false,
      });

      ctx.reply(`🔇 Muted ${repliedUser.first_name}.`);
      await logAction("mute", repliedUser, ctx.from, ctx.chat);
    } catch (err) {
      console.error("❌ Mute Command Error:", err);
      ctx.reply("❌ Failed to mute user. Please try again.");
    }
  });

  // 🔹 Unmute a user
  bot.command("unmute", isAdmin, async (ctx) => {
    try {
      const repliedUser = ctx.message.reply_to_message?.from;
      if (!repliedUser) return ctx.reply("⚠️ Reply to a user to unmute.");

      await ctx.telegram.restrictChatMember(ctx.chat.id, repliedUser.id, {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
      });

      ctx.reply(`🔊 Unmuted ${repliedUser.first_name}.`);
      await logAction("unmute", repliedUser, ctx.from, ctx.chat);
    } catch (err) {
      console.error("❌ Unmute Command Error:", err);
      ctx.reply("❌ Failed to unmute user. Please try again.");
    }
  });

  // 🔹 Promote a user to admin
  bot.command("promote", isAdmin, async (ctx) => {
    try {
      const repliedUser = ctx.message.reply_to_message?.from;
      if (!repliedUser) return ctx.reply("⚠️ Reply to a user to promote.");

      await ctx.telegram.promoteChatMember(ctx.chat.id, repliedUser.id, {
        can_change_info: true,
        can_delete_messages: true,
        can_invite_users: true,
        can_restrict_members: true,
        can_pin_messages: true,
        can_promote_members: false, // Prevent promoting others
      });

      ctx.reply(`🔝 Promoted ${repliedUser.first_name} to admin.`);
      await logAction("promote", repliedUser, ctx.from, ctx.chat);
    } catch (err) {
      console.error("❌ Promote Command Error:", err);
      ctx.reply("❌ Failed to promote user. Please try again.");
    }
  });

  // 🔹 Demote an admin back to user
  bot.command("demote", isAdmin, async (ctx) => {
    try {
      const repliedUser = ctx.message.reply_to_message?.from;
      if (!repliedUser) return ctx.reply("⚠️ Reply to an admin to demote.");

      await ctx.telegram.promoteChatMember(ctx.chat.id, repliedUser.id, {
        can_change_info: false,
        can_delete_messages: false,
        can_invite_users: false,
        can_restrict_members: false,
        can_pin_messages: false,
        can_promote_members: false,
      });

      ctx.reply(`⬇️ Demoted ${repliedUser.first_name} to a regular user.`);
      await logAction("demote", repliedUser, ctx.from, ctx.chat);
    } catch (err) {
      console.error("❌ Demote Command Error:", err);
      ctx.reply("❌ Failed to demote user. Please try again.");
    }
  });

};
