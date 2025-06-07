const express = require('express');
const router = express.Router();

// read template from db
const templates = {
  1: { id: 1, title: 'Schedule Reminder', subject: 'Reminder', html: '<p>This is a reminder.</p>' },
  2: { id: 2, title: 'Thank You', subject: 'Thanks!', html: '<p>Thank you for volunteering.</p>' }
};

router.get('/templates/:id', (req, res) => {
  const id = req.params.id;
  const template = templates[id];

  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.json(template);
});

router.get('/templates', (req, res) => {
  const allTemplates = Object.values(templates);
  res.json(allTemplates);
});

module.exports = router;
