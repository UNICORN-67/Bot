const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    groupId: { type: Number, required: true, unique: true },
    welcomeMessage: { type: String, default: "Welcome to the group!" },
    antiSpam: { type: Boolean, default: false },
    linkProtection: { type: Boolean, default: false },
    nsfwFilter: { type: Boolean, default: false },
    badWordFilter: { type: Boolean, default: false },
    logChannelId: { type: Number, default: null } // Channel ID for logs
});

module.exports = mongoose.model("Settings", settingsSchema);
