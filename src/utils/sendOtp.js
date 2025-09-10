// src/utils/sendOtp.js
// const twilio = require('twilio');

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// async function sendOtpSms(to, otp) {
//   try {
//     const message = await client.messages.create({
//       body: `Your OTP is: ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER, // Twilio number
//       to: to
//     });
//     console.log('Message sent:', message.sid);
//     return true;
//   } catch (err) {
//     console.error('Error sending OTP via SMS:', err);
//     return false;
//   }
// }

// module.exports = { sendOtpSms };



// sendOtp.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ID; // optional
const SENDER      = process.env.SENDGRID_SENDER;

async function sendOtpEmail(to, otp) {
  // Build the payload
  const msg = {
    to,
    from: { name: 'AARC_STAGE', email:SENDER},
    subject: 'AARC STAGE OTP',
    text: `Your AARC verification code is  ${otp}`,
    html: `<p>Your AARC verification code is: <strong>${otp}</strong></p>
    It expires in 5 minutes — please do not share it with anyone.`,

    
    // templateId: TEMPLATE_ID,
    // dynamicTemplateData: { otp },
  };

  try {
    const [response] = await sgMail.send(msg);
    console.log(`✅  Mail sent to ${to} – id ${response.headers['x-message-id']}`);
    return true;
  } catch (err) {
    // SendGrid puts the real reason here:
    console.error('❌  SendGrid error:', err.response?.body?.errors || err);
    return false;
  }
}

module.exports = { sendOtpEmail };


// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// async function sendOtpEmail(to, otp) {
//   const msg = {
//     to, // recipient email
//     from: process.env.SENDGRID_SENDER, // verified sender email
//     subject: 'Your OTP Code',
//     text: `Your OTP is: ${otp}`,
//     html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
//   };

//   try {
//     await sgMail.send(msg);
//     console.log('Email sent successfully to', to);
//     return true;
//   } catch (err) {
//     console.error('Error sending OTP via email:', err);
//     return false;
//   }
// }

// module.exports = { sendOtpEmail };
