// socket.js
const jwt = require('jsonwebtoken');
module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch { next(new Error('Invalid token')); }
  });

  io.on('connection', (socket) => {
    const uid = socket.user.uid;

    // join own room (for push)
    socket.join(`user:${uid}`);

    socket.on('join-chat', async (otherId) => {
      const room = await getOrCreateConversation(uid, otherId);
      socket.join(`conv:${room._id}`);
      socket.to(`conv:${room._id}`).emit('user-typing', { typing: false });
    });

    socket.on('send-message', async ({ text, toUserId }) => {
      const room = await getOrCreateConversation(uid, toUserId);
      const msg  = await Message.create({
        conversationId: room._id,
        senderId: uid,
        text: text.trim()
      });
      // update lastMessage
      await Conversation.updateOne({ _id: room._id }, {
        lastMessage: { text, sender: uid, createdAt: new Date() },
        updatedAt: new Date()
      });
      // broadcast to everyone in this room
      io.to(`conv:${room._id}`).emit('new-message', msg);
    });

    socket.on('disconnect', () => {});
  });
};