const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    username: { type: String, default: "Unknown" },
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    language: { type: String, default: "Unknown" },
    isAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    joinDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
