const mongoose = require('mongoose');

const NotificationTypeSchema = new mongoose.Schema({
  notification_type_id: Number,
  name: String,
  description: String,
  category: { type: String, enum: ['Credential', 'Booking', 'System', 'Custom'] },
  severity: { type: String, enum: ['Info', 'Warning', 'Critical'] },
  icon: String,
  color_code: String,
  is_active: Boolean,
  affects_booking: Boolean,
  affected_services: [String],
  auto_status_change: Boolean,
  new_status: String,
  created_at: Date,
  updated_at: Date
});

module.exports = mongoose.model('NotificationType', NotificationTypeSchema);
