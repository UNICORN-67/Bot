const mongoose = require('mongoose');

const nsfwSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  username: {
    type: String
  },
  chatId: {
    type: Number,
    required: true
  },
  messageId: {
    type: Number
  },
  fileType: {
    type: String, // 'photo', 'video', 'sticker', etc.
    required: true
  },
  detectedAt: {
    type: Date,
    default: Date.now
  },
  confidence: {
    type: Number // Confidence score of AI detection
  },
  status: {
    type: String,
    default: 'removed'
  }
});

module.exports = mongoose.model('NSFWLog', nsfwSchema);