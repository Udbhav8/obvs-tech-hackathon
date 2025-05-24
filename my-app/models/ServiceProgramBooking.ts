import { Schema, model } from 'mongoose';

const serviceProgramBookingSchema = new Schema({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  service_type: { type: String, required: true },
  pickup_address_description: { type: String, required: true },
  pickup_address_street: { type: String, required: true },
  pickup_address_city: { type: String, required: true },
  destination_address_description: { type: String, default: null },
  destination_address_street: { type: String, default: null },
  destination_address_city: { type: String, default: null }
});

export default model('ServiceProgramBooking', serviceProgramBookingSchema);
