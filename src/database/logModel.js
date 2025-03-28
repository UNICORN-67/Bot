const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["ban", "unban", "mute", "unmute", "kick", "promote", "demote"],
      required: true,
    },
    user: {
      id: { type: Number, required: true },
      username: { type: String },
      first_name: { type: String, required: true },
    },
    admin: {
      id: { type: Number, required: true },
      username: { type: String },
      first_name: { type: String, required: true },
    },
    chat: {
      id: { type: Number, required: true },
      title: { type: String },
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
