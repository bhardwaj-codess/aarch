const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const chatCtrl = require('../controllers/chat.controller');


// router.get('/:role(users|artists|organizers)', authMiddleware, chatCtrl.getRoleList);
router.get('/users', authMiddleware, chatCtrl.getUsers);
router.get('/artists', authMiddleware, chatCtrl.getArtists);
router.get('/organizers', authMiddleware, chatCtrl.getOrganizers);

// Conversation APIs
router.get('/conversation/:otherUserId', authMiddleware, chatCtrl.getConversation);
router.post('/message', authMiddleware, chatCtrl.sendMessage); // optional REST message

module.exports = router;
