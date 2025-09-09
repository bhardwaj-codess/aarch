// // Simple SMS Service - Replace with real SMS provider
// // For now, this simulates SMS sending and returns a test OTP

// function generateTestOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Store OTPs temporarily (in production, use Redis or database)
// const otpStore = new Map();

// async function sendSMS(phoneNumber, message) {
//   try {
//     console.log(`📱 SMS to ${phoneNumber}: ${message}`);
    
//     // Generate a test OTP
//     const otp = generateTestOTP();
    
//     // Store OTP for verification (expires in 5 minutes)
//     otpStore.set(phoneNumber, {
//       otp,
//       expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
//     });
    
//     // In production, replace this with actual SMS provider
//     // Examples:
//     // - Twilio: twilio.messages.create()
//     // - AWS SNS: sns.publish()
//     // - MSG91: axios.post()
    
//     return {
//       success: true,
//       message: 'SMS sent successfully',
//       phoneNumber,
//       // For development, return the OTP
//       devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
//     };
//   } catch (error) {
//     console.error('SMS sending error:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }

// async function verifyOTP(phoneNumber, otp) {
//   try {
//     const storedData = otpStore.get(phoneNumber);
    
//     if (!storedData) {
//       return { success: false, error: 'No OTP requested for this number' };
//     }
    
//     if (Date.now() > storedData.expiresAt) {
//       otpStore.delete(phoneNumber);
//       return { success: false, error: 'OTP expired' };
//     }
    
//     if (storedData.otp === otp) {
//       otpStore.delete(phoneNumber);
//       return { success: true, verified: true };
//     }
    
//     return { success: false, error: 'Invalid OTP' };
//   } catch (error) {
//     console.error('OTP verification error:', error);
//     return { success: false, error: error.message };
//   }
// }

// // Clean up expired OTPs periodically
// setInterval(() => {
//   const now = Date.now();
//   for (const [phone, data] of otpStore.entries()) {
//     if (now > data.expiresAt) {
//       otpStore.delete(phone);
//     }
//   }
// }, 60000); // Clean every minute

// module.exports = {
//   sendSMS,
//   verifyOTP
// };



const axios = require("axios");

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

/**
 * Send OTP via MSG91 Transactional Template
 * @param {string} phoneNumber - user phone without country code
 * @param {string} otp - OTP to send
 */
async function sendSMS(phoneNumber, otp) {
  try {
    const url = "https://control.msg91.com/api/v5/flow/";

    const payload = {
      template_id: MSG91_TEMPLATE_ID,
      recipients: [
        {
          mobiles: "91" + phoneNumber,
          otp: otp   // must match {{otp}} in template
        }
      ]
    };

    const response = await axios.post(url, payload, {
      headers: {
        authkey: MSG91_AUTH_KEY,
        "Content-Type": "application/json"
      }
    });

    return {
      success: true,
      message: "OTP sent successfully via MSG91",
      data: response.data,
      devOtp: process.env.NODE_ENV === "development" ? otp : undefined
    };
  } catch (error) {
    console.error("MSG91 Send OTP Error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

module.exports = { sendSMS };






// const axios = require("axios");

// const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
// const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

// /**
//  * Send OTP via MSG91
//  * @param {string} phoneNumber - user phone without country code
//  * @param {string} otp - OTP to send
//  */
// async function sendSMS(phoneNumber, otp) {
//   try {
//     // Call MSG91 API
//     const url = `https://control.msg91.com/api/v5/otp?template_id=${MSG91_TEMPLATE_ID}&mobile=91${phoneNumber}&otp=${otp}`;

//     await axios.post(url, {}, {
//       headers: {
//         authkey: MSG91_AUTH_KEY,
//         "Content-Type": "application/json"
//       }
//     });

//     return {
//       success: true,
//       message: "OTP sent successfully via MSG91",
//       phoneNumber,
//       devOtp: process.env.NODE_ENV === "development" ? otp : undefined
//     };
//   } catch (error) {
//     console.error("MSG91 Send OTP Error:", error.response?.data || error.message);
//     return {
//       success: false,
//       error: error.response?.data || error.message
//     };
//   }
// }

// module.exports = {
//   sendSMS
// };


  