// models/Conversation.js
const conversationSchema = new Schema({
  participants: [{ type: ObjectId, ref: 'User' }],   // always 2 people
  lastMessage:  { text: String, sender: ObjectId, createdAt: Date },
  updatedAt:    { type: Date, default: Date.now }
});

// models/Message.js
const messageSchema = new Schema({
  conversationId: { type: ObjectId, ref: 'Conversation', index: true },
  senderId:       { type: ObjectId, ref: 'User' },
  text:           { type: String, maxlength: 1000 },
  read:           { type: Boolean, default: false }
}, { timestamps: true });