const mongoose = require('mongoose');

const NotificationTemplateSchema = new mongoose.Schema({
  template_id: Number,
  notification_type_id: Number,
  name: String,
  subject: String,
  body_text: String,
  body_html: String,
  delivery_method: {
    type: String,
    enum: ['Email', 'SMS', 'InApp', 'Multiple']
  },
  is_default: Boolean,
  created_at: Date,
  updated_at: Date
});

module.exports = mongoose.model('NotificationTemplate', NotificationTemplateSchema);
