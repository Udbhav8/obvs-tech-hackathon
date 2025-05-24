import mongoose from 'mongoose';

const bookingVolunteerRelationSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  volunteer_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: {
    type: String,
    enum: ['Possible', 'Left Voicemail', 'Emailed', 'Assigned', 'Unavailable'],
    required: true
  }
});

module.exports = mongoose.model('BookingVolunteerRelation', bookingVolunteerRelationSchema);
