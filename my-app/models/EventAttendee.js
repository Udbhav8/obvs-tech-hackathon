const mongoose = require('mongoose');

const eventAttendeeSchema = new mongoose.Schema({
  event_booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EventBooking', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  external_name: { type: String, default: null },
  user_type: {
    type: String,
    enum: ['Client', 'Volunteer', 'Staff', 'External'],
    required: true
  }
});

module.exports = mongoose.model('EventAttendee', eventAttendeeSchema);
