

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    language: { type: String, default: 'unknown' },
    isAdmin: { type: Boolean, default: false },
    warnings: { type: Number, default: 0 },
    banned: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
    isBot: { type: Boolean, default: false },
    chatId: { type: String }, // optionally track chat they're active in
}, {
    timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);


---

What’s Added/Improved:

fullName: You can store it separately instead of joining firstName + lastName.

warnings: Count of warnings (e.g. from spam/abuse).

banned: Track if user is banned.

lastSeen: Update on message or interaction.

isBot: To differentiate between bot users.

chatId: Track the last chat they interacted in.

timestamps: Adds createdAt and updatedAt automatically.


Let me know if you want to auto-update these fields on activity or add methods!

