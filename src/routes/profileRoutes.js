const express = require('express');
const { UpdateProfile, getMyProfile, getProfileByUserId } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/auth'); // must resolve to function
console.log('authMiddleware type:', typeof authMiddleware);


const router = express.Router();

router.post('/edit', authMiddleware, UpdateProfile);
router.get('/me', authMiddleware, getMyProfile);
router.get('/:userId', getProfileByUserId);

module.exports = router;
