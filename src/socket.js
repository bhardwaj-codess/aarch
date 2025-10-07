// socket.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

async function getOrCreateConversation(uid1, uid2) {
  console.log('[getOrCreateConversation]', uid1, uid2);
  const pair = [uid1, uid2].sort();
  let conv = await Conversation.findOne({ participants: pair });
  if (!conv) {
    console.log('[getOrCreateConversation] creating new conv');
    conv = await Conversation.create({ participants: pair });
  }
  return conv;
}

module.exports = (io) => {
  io.use((socket, next) => {
    console.log('[io.use] handshake headers', socket.handshake.headers);
    console.log('[io.use] auth object', socket.handshake.auth);
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log('[io.use] no token');
      return next(new Error('No token'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[io.use] decoded', decoded);
      socket.user = decoded;
      next();
    } catch (e) {
      console.log('[io.use] jwt error', e.message);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('[connection] user connected', socket.user);
    const uid = socket.user?.uid;
    if (!uid) {
      console.log('[connection] no uid – forcing disconnect');
      return socket.disconnect(true);
    }
    socket.join(`user:${uid}`);

    socket.on('join-chat', async (otherId) => {
      console.log('[join-chat] incoming otherId', otherId);
      try {
        const room = await getOrCreateConversation(uid, otherId);
        socket.join(`conv:${room._id}`);
        socket.emit('joined', { roomId: room._id });
        console.log('[join-chat] success, roomId', room._id);
      } catch (e) {
        console.error('[join-chat] crash', e.message, e.stack);
        socket.emit('error', { message: 'Join failed' });
      }
    });

    socket.on('send-message', async ({ text, toUserId }) => {
      console.log('[send-message] text', text, 'to', toUserId);
      try {
        const room = await getOrCreateConversation(uid, toUserId);
        const msg = await Message.create({
          conversationId: room._id,
          senderId: uid,
          text: text.trim()
        });
        await Conversation.updateOne(
          { _id: room._id },
          { lastMessage: { text, sender: uid, createdAt: new Date() } }
        );
        io.to(`conv:${room._id}`).emit('new-message', msg);
        console.log('[send-message] broadcast done');
      } catch (e) {
        console.error('[send-message] crash', e.message, e.stack);
        socket.emit('error', { message: 'Send failed' });
      }
    });

    socket.on('disconnect', () => console.log('[disconnect]'));
  });
};