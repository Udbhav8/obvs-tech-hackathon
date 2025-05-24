const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  booking_type: {
    type: String,
    enum: ['Service', 'Program', 'Support Service', 'Event'],
    required: true
  },
  status: {
    type: String,
    enum: ['Assigned', 'Not Assigned', 'Cancelled', 'Deleted'],
    required: true
  },
  frequency_type: {
    type: String,
    enum: ['One-Time', 'Continuous', 'Ongoing'],
    required: true
  },
  date: { type: Date, required: true },
  start_time: { type: String, match: /^([01]\d|2[0-3]):([0-5]\d)$/, required: true },
  appointment_time: { type: String, match: /^([01]\d|2[0-3]):([0-5]\d)$/, required: true },
  appointment_length: { type: Number, required: true }, // in minutes
  full_duration: { type: Number, required: true }, // in minutes
  notes: { type: String, maxlength: 2000 },
  num_volunteers_needed: { type: Number, min: 1, max: 4, default: 1 },
  client_confirmation: { type: Boolean, required: true },
  cancellation_reason: {
    type: String,
    enum: ['Client - Provider', 'Client - Health', 'Client - Other', 'Volunteer - Health', 'Volunteer - Other', 'No Volunteers Available', null],
    default: null
  },
  cancellation_notes: { type: String, default: null },
  is_parent_booking: { type: Boolean, required: true },
  parent_booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  end_date: { type: Date, default: null },
  recurrence_frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Annually', null],
    default: null
  },
  recurrence_days: { type: [Number], default: null }, // 0 = Sunday, 6 = Saturday
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
