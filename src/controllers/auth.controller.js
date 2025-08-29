const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Roles } = require('../models/User');
const { generateOtp, hashOtp } = require('../utils/otp');

const OTP_EXP_MINUTES = parseInt(process.env.OTP_EXP_MINUTES || '5', 10);

async function requestOtp(req, res) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    const otp = generateOtp(6);
    const otpHash = hashOtp(otp, phone);
    const otpExpiresAt = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, otpHash, otpExpiresAt });
    } else {
      user.otpHash = otpHash;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    }

    // TODO: Integrate SMS provider. For now, return OTP only in development.
    const payload = process.env.NODE_ENV === 'development' ? { devOtp: otp } : {};
    return res.status(200).json({ message: 'OTP sent', ...payload });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to request OTP' });
  }
}

async function verifyOtp(req, res) {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });

    const user = await User.findOne({ phone });
    if (!user || !user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'No OTP requested' });
    }
    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const providedHash = hashOtp(otp, phone);
    if (providedHash !== user.otpHash) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isPhoneVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = jwt.sign({ uid: user._id, phone: user.phone, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({ message: 'OTP verified', token, role: user.role });
  } catch (err) {
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
    return res.status(500).json({ message: 'Failed to set role' });
  }
}

module.exports = { requestOtp, verifyOtp, setRole };


