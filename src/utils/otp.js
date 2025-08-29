const crypto = require('crypto');

function generateOtp(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  const otp = Math.floor(min + Math.random() * (max - min + 1));
  return String(otp);
}

function hashOtp(otp, phone) {
  const hmac = crypto.createHmac('sha256', process.env.JWT_SECRET || 'fallback-secret');
  hmac.update(`${phone}:${otp}`);
  return hmac.digest('hex');
}

module.exports = { generateOtp, hashOtp };


