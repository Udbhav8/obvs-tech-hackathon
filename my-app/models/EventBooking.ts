import mongoose from 'mongoose';

const eventBookingSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  setup_time_start: { type: String, match: /^([01]\d|2[0-3]):([0-5]\d)$/, default: null },
  setup_time_end: { type: String, match: /^([01]\d|2[0-3]):([0-5]\d)$/, default: null },
  takedown_time_start: { type: String, match: /^([01]\d|2[0-3]):([0-5]\d)$/, default: null },
  takedown_time_end: { type: String, match: /^([01]\d|2[0-3]):([0-5]\d)$/, default: null },
  location_description: { type: String, required: true },
  location_street: { type: String, required: true },
  location_city: { type: String, required: true }
});

module.exports = mongoose.model('EventBooking', eventBookingSchema);
