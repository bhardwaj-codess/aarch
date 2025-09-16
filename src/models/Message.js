// models/Message.js
const { Schema, model, Types } = require('mongoose');

const messageSchema = new Schema({
  conversationId: { type: Types.ObjectId, ref: 'Conversation', index: true, required: true },
  senderId:       { type: Types.ObjectId, ref: 'User', required: true },
  text:           { type: String, required: true, maxlength: 1000 },
  read:           { type: Boolean, default: false }
}, { timestamps: true });

module.exports = model('Message', messageSchema);