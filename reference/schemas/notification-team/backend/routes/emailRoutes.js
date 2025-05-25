// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
// const { sendEmail } = require('../services/emailService');
const { sendEmail } = require('../testSend.js');

router.post('/notifications/send', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await sendEmail(to, subject, html);
    res.json({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
