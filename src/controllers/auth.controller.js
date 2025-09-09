const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Roles } = require('../models/User');
const sendEmail = require('../utils/sendEmail');        
const { sendOtpSms } = require('../utils/sendOtp');  
const { generateOtp } = require('../utils/otp');

const sessionStore = new Map();   

// request OTP 
async function requestOtp(req, res) {
  try {
    const { email } = req.body;

    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }


    // const existing = await User.findOne({ email });
    // if (existing) {
    //   return res.status(409).json({ message: 'Email already registered' });
    // }

    
    const user = await User.create({ email });

    const otp = generateOtp();
    await sendOtpSms(
      email,
      'AARC – Your verification code',
      `Your OTP is ${otp}. It expires in 5 minutes.`
    );

    sessionStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      email,
      devOtp: otp
    });
  } catch (err) {
    console.error('Request OTP error:', err);
    return res.status(500).json({  success: false, message: 'Failed to request OTP' });
  }
}

// verify OTP  
async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email) {
      console.log('success false – email required');
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    if (!otp) {
      console.log('success false – OTP required');
      return res.status(400).json({ success: false, message: 'OTP required' });
    }

    // OTP must be exactly 4 digits
    if (!/^\d{4}$/.test(otp)) {
      console.log('success false – enter 4-digit OTP');
      return res.status(400).json({ success: false, message: 'Enter 4-digit OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('success false – user not found');
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const sessionData = sessionStore.get(email);
    if (!sessionData) {
      console.log('success false – OTP expired or not requested');
      return res.status(400).json({ success: false, message: 'OTP expired or not requested' });
    }

    if (Date.now() > sessionData.expiresAt) {
      sessionStore.delete(email);
      console.log('success false – OTP expired');
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (sessionData.otp !== otp) {
      console.log('success false – invalid OTP');
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP verified successfully
    sessionStore.delete(email);

    user.isEmailVerified = true;
    await user.save();

    const token = jwt.sign(
      { uid: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('success true – email verified');
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      role: user.role
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    console.log('success false – server error');
    return res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
}


//Set role
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

    return res.status(200).json({ message: 'Role updated', success:true, role: user.role });
  } catch (err) {
    console.error('Set role error:', err);
    return res.status(500).json({ message: 'Failed to set role' });
  }
}

module.exports = { requestOtp, verifyOtp, setRole };
