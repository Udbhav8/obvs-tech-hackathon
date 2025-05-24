const mongoose = require('mongoose');

const jobHistorySchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobHistory', jobHistorySchema);
