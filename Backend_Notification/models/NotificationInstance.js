const mongoose = require('mongoose');

const NotificationInstanceSchema = new mongoose.Schema({
  notification_id: Number,
  rule_id: Number,
  user_id: Number,
  related_entity_type: String,
  related_entity_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Sent', 'Failed', 'Acknowledged']
  },
  scheduled_time: Date,
  sent_time: Date,
  acknowledged_time: Date,
  acknowledged_by: Number,
  delivery_method: {
    type: String,
    enum: ['Email', 'SMS', 'InApp', 'Multiple']
  },
  delivery_details: Object,
  error_message: String,
  retry_count: Number,
  next_retry_time: Date,
  created_at: Date
});

module.exports = mongoose.model('NotificationInstance', NotificationInstanceSchema);
