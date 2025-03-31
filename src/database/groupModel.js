const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupId: { type: Number, required: true, unique: true },
    groupName: { type: String, required: true },
    ownerId: { type: Number, required: true }, // Group Owner's ID
    admins: { type: [Number], default: [] }, // List of admin user IDs
    membersCount: { type: Number, default: 0 },
    joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Group", groupSchema);
