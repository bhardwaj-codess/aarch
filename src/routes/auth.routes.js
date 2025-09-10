const { Router } = require('express');
const { requestOtp, resendOtp, verifyOtp, setRole } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth');

const router = Router();

router.post('/request-otp', requestOtp);
router.post('/resend-otp', resendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/set-role', authMiddleware, setRole);

module.exports = router;


