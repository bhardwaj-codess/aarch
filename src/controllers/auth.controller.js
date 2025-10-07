const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Roles } = require('../models/User');     
const Feedback = require('../models/Feedback');
const Artist = require('../models/Artist');
const SupportTicket = require('../models/SupportTicket');
const { sendOtpEmail } = require('../utils/sendOtp');  
const { generateOtp } = require('../utils/otp');

const sessionStore = new Map();   

// request-otp
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

      
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ email });   
      }
      
      const otp = generateOtp();               
      await sendOtpEmail(email, otp);        

      
      sessionStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000  
      });

      return res.status(200).json({
        status: true,
        data: {
          message: 'OTP sent to your email',
          email,
          devOtp: otp
        }                      
      });
    } catch (err) {
      console.error('Request OTP error:', err);
      return res.status(500).json({ status: false, message: 'Failed to request OTP' });
    }
  }

//resend otp
async function resendOtp(req, res) {
  try {
    const { email } = req.body;

    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No OTP request found for this email' });
    }

    const otp = generateOtp();
    await sendOtpEmail(email, otp);

    sessionStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 
    });

    return res.status(200).json({
      status: true,
       data: {
        message: 'OTP sent to your email',
        email,
        devOtp: otp
      }
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ status: false, message: 'Failed to resend OTP' });
  }
}

// verify OTP  
async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email) {
      console.log('status false – email required');
      return res.status(400).json({ status: false, message: 'Email required' });
    }

    if (!otp) {
      console.log('status false – OTP required');
      return res.status(400).json({ status: false, message: 'OTP required' });
    }

    // OTP must be exactly 4 digits
    if (!/^\d{4}$/.test(otp)) {
      console.log('status false – enter 4-digit OTP');
      return res.status(400).json({ status: false, message: 'Enter 4-digit OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('status false – user not found');
      return res.status(400).json({ status: false, message: 'User not found' });
    }

    const sessionData = sessionStore.get(email);
    if (!sessionData) {
      console.log('status false – OTP expired or not requested');
      return res.status(400).json({ status: false, message: 'OTP expired' });
    }

    if (Date.now() > sessionData.expiresAt) {
      sessionStore.delete(email);
      console.log('status false – OTP expired');
      return res.status(400).json({ status: false, message: 'OTP expired' });
    }

    if (sessionData.otp !== otp) {
      console.log('status false – invalid OTP');
      return res.status(400).json({ status: false, message: 'Invalid OTP' });
    }

    // OTP verified statusfully
    // sessionStore.delete(email);
    // const exist_user = Date.now() - user.createdAt.getTime() > 10_000;

    const exist_user = user.isEmailVerified; 

    user.isEmailVerified = true;
    await user.save();

    const token = jwt.sign(
      { uid: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('status true – email verified');
    return res.status(200).json({
      status: true,
      data: {
      message: 'Email verified statusfully',
      token,
      role: user.role,
      exist_user,
      id: user._id 
      },
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    console.log('status false – server error');
    return res.status(500).json({ status: false, message: 'Failed to verify OTP' });
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

    return res.status(200).json({ message: 'Role updated', status:true, role: user.role });
  } catch (err) {
    console.error('Set role error:', err);
    return res.status(500).json({ message: 'Failed to set role' });
  }
}

// Delete account 
async function deleteAccount(req, res) {
  try {
    const userId = req.user.uid;          
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    if (user.deleteRequestedAt)
      return res.status(400).json({ status: false, message: "Deletion already requested" });

    // Just mark timestamp
    user.deleteRequestedAt = new Date();
    await user.save();

    return res.status(200).json({
      status: true,
      data: { message: "Account deletion requested. Your data will be removed after 2 minutes." }
    });

  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ status: false, message: "Failed to delete account" });
  }
}



module.exports = {
  requestOtp,
  resendOtp,
  verifyOtp,
  setRole,
  deleteAccount,
};