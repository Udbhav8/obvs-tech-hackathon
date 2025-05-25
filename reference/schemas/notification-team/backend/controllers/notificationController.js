const NotificationType = require('../models/NotificationType');

exports.sendNotification = async (req, res) => {
  try {
    const { user, type } = req.body;
    // ez logic
    console.log(`Sending ${type} notification to user ${user}`);
    res.json({ message: 'Notification sent (mock)' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTemplates = async (req, res) => {
  try {
    const templates = await NotificationType.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};