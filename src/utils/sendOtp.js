const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const TEMPLATE_ID = process.env.SENDGRID_TEMPLATE_ID; 
const SENDER      = process.env.SENDGRID_SENDER;

async function sendOtpEmail(to, otp) {
 
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
    console.log(`  Mail sent to ${to} – id ${response.headers['x-message-id']}`);
    return true;
  } catch (err) {
    // SendGrid puts the real reason here:
    console.error('  SendGrid error:', err.response?.body?.errors || err);
    return false;
  }
}

module.exports = { sendOtpEmail };

