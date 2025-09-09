// utils/sendOtp.js
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendOtpSms(to, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
      to: to
    });
    console.log("Message sent:", message.sid);
    return true;
  } catch (err) {
    console.error("Error sending OTP via SMS:", err);
    return false;
  }
}
