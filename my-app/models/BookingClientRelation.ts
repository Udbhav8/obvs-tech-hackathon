import mongoose from 'mongoose';

const bookingClientRelationSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  client_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  is_primary: { type: Boolean, required: true }
});

module.exports = mongoose.model('BookingClientRelation', bookingClientRelationSchema);
