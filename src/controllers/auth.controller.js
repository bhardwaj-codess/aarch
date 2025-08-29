const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Roles } = require('../models/User');
const { sendPhoneVerification, verifyPhoneCode } = require('../utils/firebaseAuth');

// Store session info temporarily (in production, use Redis or database)
const sessionStore = new Map();

async function requestOtp(req, res) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    // Create or find user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    // Send verification via Firebase Phone Auth
    const result = await sendPhoneVerification(phone);
    
    if (result.success) {
      // Store session info for verification
      if (result.sessionInfo) {
        sessionStore.set(phone, {
          sessionInfo: result.sessionInfo,
          expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        });
      }
      
      const response = {
        message: 'OTP sent to your phone number via Firebase',
        phone: phone
      };
      
      return res.status(200).json(response);
    } else {
      return res.status(500).json({ message: 'Failed to send OTP', error: result.error });
    }
  } catch (err) {
    console.error('Request OTP error:', err);
    return res.status(500).json({ message: 'Failed to request OTP' });
  }
}

async function verifyOtp(req, res) {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });

    // Find user
    let user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Get session info
    const sessionData = sessionStore.get(phone);
    const sessionInfo = sessionData ? sessionData.sessionInfo : null;

    // Verify the OTP using Firebase
    const verificationResult = await verifyPhoneCode(phone, otp, sessionInfo);
    
    if (!verificationResult.success || !verificationResult.verified) {
      return res.status(400).json({ message: verificationResult.error || 'Invalid OTP' });
    }

    // Clean up session
    sessionStore.delete(phone);

    // Mark phone as verified
    user.isPhoneVerified = true;
    await user.save();

    const token = jwt.sign({ uid: user._id, phone: user.phone, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({ 
      message: 'Phone verified successfully via Firebase', 
      token, 
      role: user.role 
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
}

async function setRole(req, res) {
  try {
    const { role } = req.body;
    const userId = req.user && req.user.uid;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!role || !Roles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    return res.status(200).json({ message: 'Role updated', role: user.role });
  } catch (err) {
    console.error('Set role error:', err);
    return res.status(500).json({ message: 'Failed to set role' });
  }
}

module.exports = { requestOtp, verifyOtp, setRole };


