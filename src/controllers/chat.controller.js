// controller/chat.controller.js
const { User } = require('../models/User');
const { Conversation, Message } = require('../models/Conversation');


exports.getRoleList = (role) => async (req, res) => {
  try {
    const page  = +req.query.page  || 1;
    const limit = +req.query.limit || 30;
    const skip  = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({ role })
          .select('name avatar city country')
          .skip(skip)
          .limit(limit)
          .lean(),
      User.countDocuments({ role })
    ]);

    res.json({ status: true, data: { users, total, page } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Export shortcuts for each role
exports.getUsers      = exports.getRoleList('user');
exports.getArtists    = exports.getRoleList('artist');
exports.getOrganizers = exports.getRoleList('organizer');

// Get or create conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const userId1 = req.user.uid;           // logged-in user
    const userId2 = req.params.otherUserId; // other participant

    // 1️⃣ Find conversation between two participants
    let conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] }
    });

    // 2️⃣ Create if not exists
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId1, userId2]
      });
    }

    // 3️⃣ Fetch messages
    const messages = await Message.find({ conversationId: conversation._id })
                                  .sort({ createdAt: 1 })
                                  .lean();

    res.json({
      status: true,
      data: { conversation, messages }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

// Send a message in a conversation 
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.uid;
    const { toUserId, text } = req.body;

    if (!toUserId || !text) {
      return res.status(400).json({ status: false, message: 'toUserId and text are required' });
    }

    // 1️⃣ Get or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, toUserId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [senderId, toUserId] });
    }

    // 2️⃣ Save message
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      text: text.trim()
    });

    // 3️⃣ Update lastMessage in conversation
    await Conversation.updateOne(
      { _id: conversation._id },
      { lastMessage: { text, sender: senderId, createdAt: new Date() } }
    );

    res.json({ status: true, data: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};
