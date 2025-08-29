// Simple SMS Service - Replace with real SMS provider
// For now, this simulates SMS sending and returns a test OTP

function generateTestOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

async function sendSMS(phoneNumber, message) {
  try {
    console.log(`📱 SMS to ${phoneNumber}: ${message}`);
    
    // Generate a test OTP
    const otp = generateTestOTP();
    
    // Store OTP for verification (expires in 5 minutes)
    otpStore.set(phoneNumber, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });
    
    // In production, replace this with actual SMS provider
    // Examples:
    // - Twilio: twilio.messages.create()
    // - AWS SNS: sns.publish()
    // - MSG91: axios.post()
    
    return {
      success: true,
      message: 'SMS sent successfully',
      phoneNumber,
      // For development, return the OTP
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function verifyOTP(phoneNumber, otp) {
  try {
    const storedData = otpStore.get(phoneNumber);
    
    if (!storedData) {
      return { success: false, error: 'No OTP requested for this number' };
    }
    
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phoneNumber);
      return { success: false, error: 'OTP expired' };
    }
    
    if (storedData.otp === otp) {
      otpStore.delete(phoneNumber);
      return { success: true, verified: true };
    }
    
    return { success: false, error: 'Invalid OTP' };
  } catch (error) {
    console.error('OTP verification error:', error);
    return { success: false, error: error.message };
  }
}

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
    }
  }
}, 60000); // Clean every minute

module.exports = {
  sendSMS,
  verifyOTP
};
