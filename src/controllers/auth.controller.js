const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Roles } = require('../models/User');
const { sendSMS, verifyOTP } = require('../utils/smsService');

async function requestOtp(req, res) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    // Create or find user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    // Send SMS with OTP
    const message = `Your AARC Stage verification code is: ${Math.floor(100000 + Math.random() * 900000)}`;
    const result = await sendSMS(phone, message);
    
    if (result.success) {
      const response = {
        message: 'OTP sent to your phone number',
        phone: phone
      };
      
      // Include devOtp in development mode
      if (result.devOtp) {
        response.devOtp = result.devOtp;
      }
      
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

    // Verify the OTP
    const verificationResult = await verifyOTP(phone, otp);
    
    if (!verificationResult.success || !verificationResult.verified) {
      return res.status(400).json({ message: verificationResult.error || 'Invalid OTP' });
    }

    // Mark phone as verified
    user.isPhoneVerified = true;
    await user.save();

    const token = jwt.sign({ uid: user._id, phone: user.phone, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({ 
      message: 'Phone verified successfully', 
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


