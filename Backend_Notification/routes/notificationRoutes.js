const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/send', notificationController.sendNotification);
router.get('/templates', notificationController.getTemplates);

module.exports = router;