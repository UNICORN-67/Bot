const isAdmin = async (ctx, next) => {
  try {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;

    // Get chat administrators
    const admins = await ctx.telegram.getChatAdministrators(chatId);

    // Check if the user is an admin
    const isAdminUser = admins.some((admin) => admin.user.id === userId);

    if (!isAdminUser) {
      return ctx.reply("❌ *You must be an admin to use this command!*", { parse_mode: "Markdown" });
    }

    return next(); // Proceed to the next function if admin
  } catch (err) {
    console.error("❌ Admin Check Error:", err);
    return ctx.reply("⚠️ *Error checking admin status. Try again later.*", { parse_mode: "Markdown" });
  }
};

module.exports = isAdmin;
