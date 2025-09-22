// models/Conversation.js
const { Schema, model, Types } = require('mongoose');

const conversationSchema = new Schema({
  participants: [{ type: Types.ObjectId, ref: 'User', required: true }],
  lastMessage: {
    text: String,
    sender: { type: Types.ObjectId, ref: 'User' },
    createdAt: Date
  }
}, { timestamps: true });   // gives createdAt + updatedAt automatically

conversationSchema.index({ participants: 1 }, { unique: true }); // 1 conv per pair
module.exports = model('Conversation', conversationSchema);