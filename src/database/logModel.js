const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., "ban", "unban", "mute"
    userId: { type: Number, required: true },
    username: { type: String, default: "Unknown" },
    adminId: { type: Number, required: true },
    adminUsername: { type: String, default: "Unknown" },
    groupId: { type: Number, required: true },
    groupName: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);
