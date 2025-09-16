// // models/Conversation.js
// const conversationSchema = new Schema({
//   participants: [{ type: ObjectId, ref: 'User' }],   // always 2 people
//   lastMessage:  { text: String, sender: ObjectId, createdAt: Date },
//   updatedAt:    { type: Date, default: Date.now }
// });

// // models/Message.js
// const messageSchema = new Schema({
//   conversationId: { type: ObjectId, ref: 'Conversation', index: true },
//   senderId:       { type: ObjectId, ref: 'User' },
//   text:           { type: String, maxlength: 1000 },
//   read:           { type: Boolean, default: false }
// }, { timestamps: true });


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