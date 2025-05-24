const mongoose = require('mongoose');

const volunteerAbsenceSchema = new mongoose.Schema({
  volunteer_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  is_one_day: { type: Boolean, required: true },
  reason: { type: String, default: null }
});

module.exports = mongoose.model('VolunteerAbsence', volunteerAbsenceSchema);
