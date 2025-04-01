const { Markup } = require("telegraf");

// ✅ Format user data for display in chat
function formatUser(user) {
    if (!user) return "Unknown User";
    const username = user.username ? `[@${user.username}](tg://user?id=${user.id})` : `[${user.first_name}](tg://user?id=${user.id})`;
    return `${username} (${user.id})`;
}

// ✅ Format group info in a readable way
function formatGroupInfo(group) {
    return `**Group Name**: ${group.title}\n**Group ID**: ${group.id}\n**Description**: ${group.description || "No description available"}`;
}

// ✅ Format user info in a clean way
function formatUserInfo(user) {
    return `**Name**: ${user.first_name} ${user.last_name || ""}\n**Username**: ${user.username || "N/A"}\n**User ID**: ${user.id}\n**Language Code**: ${user.language_code || "N/A"}`;
}

// ✅ Format message info for logs or admin actions
function formatMessageInfo(message) {
    return `Message ID: ${message.message_id}\nFrom: ${message.from ? message.from.first_name : "Unknown"}\nText: ${message.text || "No text"}`;
}

// ✅ Format the log message for actions (like bans or unbans)
function formatLogMessage(action, user, admin) {
    return `Action: ${action}\nUser: ${formatUser(user)}\nAdmin: ${formatUser(admin)}`;
}

// ✅ Format the response for help command
function formatHelpCommand(commands) {
    let helpMessage = "*Available Commands:*\n\n";
    commands.forEach((command) => {
        helpMessage += `/${command.name} - ${command.description}\n`;
    });
    return helpMessage;
}

// ✅ Format a user ban message
function formatBanMessage(user) {
    return `🚫 *User Banned:* ${formatUser(user)}\nThe user has been banned from the group.`;
}

// ✅ Format a user unban message
function formatUnbanMessage(user) {
    return `✅ *User Unbanned:* ${formatUser(user)}\nThe user has been unbanned from the group.`;
}

// ✅ Create an inline button for commands
function createInlineButton(text, callbackData) {
    return Markup.inlineKeyboard([Markup.button.callback(text, callbackData)]);
}

// ✅ Format a message for a custom keyboard
function formatCustomKeyboard(options) {
    return Markup.keyboard(options).resize();
}

module.exports = {
    formatUser,
    formatGroupInfo,
    formatUserInfo,
    formatMessageInfo,
    formatLogMessage,
    formatHelpCommand,
    formatBanMessage,
    formatUnbanMessage,
    createInlineButton,
    formatCustomKeyboard
};
