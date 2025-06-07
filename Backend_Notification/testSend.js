// require('dotenv').config();
// const { sendEmail } = require('./services/emailService');

// (async () => {
//   try {
//     const to = 'josephlijintao@gmail.com ';
//     const subject = '🚀 Test Email from Notification System 🚀';
//     const html = '<p>Hello Joseph,<br>This is a <strong>test email</strong> from your notification service.</p>';

//     const info = await sendEmail(to, subject, html);
//     console.log('✅ Email sent successfully:', info.response);
//   } catch (error) {
//     console.error('❌ Failed to send email:', error.message);
//   }
// })();

// testSend.js
require('dotenv').config();
const { sendEmail } = require('./services/emailService');

async function sendEmailWrapper(to, subject, html) {
  try {
    const info = await sendEmail(to, subject, html);
    console.log('✅ Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
}

module.exports = { sendEmailWrapper };

