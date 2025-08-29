const { Router } = require('express');
const { requestOtp, verifyOtp, setRole } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/set-role', authMiddleware, setRole);

module.exports = router;


