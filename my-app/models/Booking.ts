import mongoose, { Document, Schema, Model } from 'mongoose';
// ------------------------------------------------------------------------------------------------
// INTERFACES
// ------------------------------------------------------------------------------------------------

// Base Booking Interface
export interface IBooking extends Document {
  booking_id: number;
  booking_type: string;
  status: string;
  frequency_type: string;
  date: Date;
  start_time: string;
  appointment_time: string;
  appointment_length: number;
  full_duration: number;
  notes?: string;
  num_volunteers_needed: number;
  client_confirmation: boolean;
  cancellation_reason?: string | null;
  cancellation_notes?: string | null;
  is_parent_booking: boolean;
  parent_booking_id?: number | null;
  end_date?: Date | null;
  recurrence_frequency?: string | null;
  recurrence_days?: number[] | null;
}

// Service/Program Booking Interface
export interface IServiceProgramBooking extends IBooking {
  service_type: string; // Using string for now to encompass all service/program types from schema
  pickup_address_description: string;
  pickup_address_street: string;
  pickup_address_city: string;
  destination_address_description?: string | null;
  destination_address_street?: string | null;
  destination_address_city?: string | null;
}

// Event Booking Interface
export interface IEventBooking extends IBooking {
  event_id: number;
  setup_time_start?: string | null;
  setup_time_end?: string | null;
  takedown_time_start?: string | null;
  takedown_time_end?: string | null;
  location_description: string;
  location_street: string;
  location_city: string;
}

// Client Interface (simplified based on booking schema, full client details are in User.ts)
export interface IClient extends Document {
  client_id: string;
  preferred_name: string;
  last_name: string;
  internal_flags: string[];
  booking_flags: string[];
  allergies?: string;
  mobility_aids?: string[];
  disability?: string;
  dnr: boolean;
  dnr_notes?: string;
  home_phone?: string | null;
  cell_phone?: string | null;
  home_address_street: string;
  home_address_city: string;
  scent_sensitivity: boolean;
  smoking: boolean;
  vehicle_requirements?: string[];
}

// Volunteer Interface (simplified based on booking schema, full volunteer details are in User.ts)
export interface IVolunteer extends Document {
  volunteer_id: string;
  preferred_name: string;
  last_name: string;
  flags: string[];
  allergies?: string;
  home_phone?: string | null;
  cell_phone?: string | null;
  email: string;
  car_type?: string | null;
  scent_sensitivity: boolean;
  smoking: boolean;
}

// Booking Client Relation Interface
export interface IBookingClientRelation extends Document {
  booking_id: number;
  client_id: string;
  is_primary: boolean;
}

// Booking Volunteer Relation Interface
export interface IBookingVolunteerRelation extends Document {
  booking_id: number;
  volunteer_id: string;
  status: string;
}

// Event Attendee Interface
export interface IEventAttendee extends Document {
  event_booking_id: number;
  user_id?: string | null; // Corresponds to user_id in User.ts if internal
  external_name?: string | null;
  user_type: string;
}

// Volunteer Absence Interface
export interface IVolunteerAbsence extends Document {
  absence_id: number;
  volunteer_id: string;
  start_date: Date;
  end_date: Date;
  is_one_day: boolean;
  reason?: string | null;
}

// Job History Interface
export interface IJobHistory extends Document {
  history_id: number;
  booking_id: number;
  user_id: string; // Corresponds to user_id in User.ts
  action: string;
  timestamp: Date;
}

// ------------------------------------------------------------------------------------------------
// SCHEMAS
// ------------------------------------------------------------------------------------------------

// Base Booking Schema
const BookingSchema = new Schema<IBooking>({
  booking_id: { type: Number, required: true, unique: true }, // Assuming booking_id is unique
  booking_type: { type: String, required: true },
  status: { type: String, required: true },
  frequency_type: { type: String, required: true },
  date: { type: Date, required: true },
  start_time: { type: String, required: true, pattern: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  appointment_time: { type: String, required: true, pattern: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  appointment_length: { type: Number, required: true },
  full_duration: { type: Number, default: null },
  notes: { type: String, minlength: 0, maxlength: 2000 },
  num_volunteers_needed: { type: Number, required: true, min: 1, max: 4, default: 1 },
  client_confirmation: { type: Boolean, required: true },
  cancellation_reason: { type: String, default: null },
  cancellation_notes: { type: String, default: null },
  is_parent_booking: { type: Boolean, required: true, default: false },
  parent_booking_id: { type: Number, default: null },
  end_date: { type: Date, default: null },
  recurrence_frequency: { type: String, default: null },
  recurrence_days: { type: [Number], default: null },
}, { timestamps: true });

// Service/Program Booking Schema
const ServiceProgramBookingSchema = new Schema<IServiceProgramBooking>({
  // Inherits from BookingSchema
  service_type: {
    type: String,
    enum: [
      "Drives Medical", "Drives Miscellaneous", "Drives Shopping", "Drives Recreation",
      "Destination Walks", "Document Assistance", "Gardening", "Minor Home Repair",
      "Packing and Sorting", "Reassurance Phone Calls", "Social Phone Call",
      "Technology Support", "Visiting", "Visiting with Drive", "Walking",
      "Walking with Drive", "Wheelchair Push", "Miscellaneous Service",
      "Ambassador", "Companion Pets", "Cultural Companions", "Holiday Gift Exchange",
      "Income Tax", "Silent Disco", "Snow Angels", "Welcome Team",
      "Accounting", "Board", "Fundraising", "Helpline", "MarComm",
      "Miscellaneous Support", "Training"
    ],
    required: true,
  },
  pickup_address_description: { type: String, required: true, default: "" },
  pickup_address_street: { type: String, required: true, default: "" },
  pickup_address_city: { type: String, required: true, default: "" },
  destination_address_description: { type: String, default: null },
  destination_address_street: { type: String, default: null },
  destination_address_city: { type: String, default: null },
});

// Event Booking Schema
const EventBookingSchema = new Schema<IEventBooking>({
  // Inherits from BookingSchema
  event_id: { type: Number, required: true },
  setup_time_start: { type: String, default: null, pattern: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  setup_time_end: { type: String, default: null, pattern: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  takedown_time_start: { type: String, default: null, pattern: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  takedown_time_end: { type: String, default: null, pattern: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  location_description: { type: String, required: true, default: "" },
  location_street: { type: String, required: true, default: "" },
  location_city: { type: String, required: true, default: "" },
});

// Client Schema (Simplified for booking context, links to User schema)
const ClientSchema = new Schema<IClient>({
  client_id: { type: String, required: true, unique: true }, // Links to user_id in User.ts
  preferred_name: { type: String, required: true, default: "" },
  last_name: { type: String, required: true, default: "" },
  internal_flags: { type: [String], default: null },
  booking_flags: { type: [String], default: null },
  allergies: { type: String },
  mobility_aids: { type: [String] },
  disability: { type: String },
  dnr: { type: Boolean, required: true, default: false },
  dnr_notes: { type: String },
  home_phone: { type: String, default: null },
  cell_phone: { type: String, default: null },
  home_address_street: { type: String, required: true, default: "" },
  home_address_city: { type: String, required: true, default: "" },
  scent_sensitivity: { type: Boolean, required: true, default: false },
  smoking: { type: Boolean, required: true, default: false },
  vehicle_requirements: { type: [String] },
}, { _id: false }); // _id: false because client_id is the primary key

// Volunteer Schema (Simplified for booking context, links to User schema)
const VolunteerSchema = new Schema<IVolunteer>({
  volunteer_id: { type: String, required: true, unique: true }, // Links to user_id in User.ts
  preferred_name: { type: String, required: true, default: "" },
  last_name: { type: String, required: true, default: "" },
  flags: { type: [String], default: null },
  allergies: { type: String },
  home_phone: { type: String, default: null },
  cell_phone: { type: String, default: null },
  email: { type: String, required: true },
  car_type: { type: String, default: null },
  scent_sensitivity: { type: Boolean, required: true, default: false },
  smoking: { type: Boolean, required: true, default: false },
}, { _id: false }); // _id: false because volunteer_id is the primary key

// Booking Client Relation Schema
const BookingClientRelationSchema = new Schema<IBookingClientRelation>({
  booking_id: { type: Number, required: true, ref: 'Booking' }, // Reference to Booking
  client_id: { type: String, required: true, ref: 'User' }, // Reference to User (Client)
  is_primary: { type: Boolean, required: true, default: false },
}, { _id: false });

// Booking Volunteer Relation Schema
const BookingVolunteerRelationSchema = new Schema<IBookingVolunteerRelation>({
  booking_id: { type: Number, required: true, ref: 'Booking' }, // Reference to Booking
  volunteer_id: { type: String, required: true, ref: 'User' }, // Reference to User (Volunteer)
  status: { type: String, required: true },
}, { _id: false });

// Event Attendee Schema
const EventAttendeeSchema = new Schema<IEventAttendee>({
  event_booking_id: { type: Number, required: true, ref: 'EventBooking' }, // Reference to EventBooking
  user_id: { type: String, default: null, ref: 'User' }, // Reference to User, nullable for external
  external_name: { type: String, default: null },
  user_type: { type: String, required: true },
});

// Volunteer Absence Schema
const VolunteerAbsenceSchema = new Schema<IVolunteerAbsence>({
  absence_id: { type: Number, required: true, unique: true },
  volunteer_id: { type: String, required: true, ref: 'User' }, // Reference to User (Volunteer)
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  is_one_day: { type: Boolean, required: true, default: false },
  reason: { type: String, default: null },
}, { timestamps: true });

// Job History Schema
const JobHistorySchema = new Schema<IJobHistory>({
  history_id: { type: Number, required: true, unique: true },
  booking_id: { type: Number, required: true, ref: 'Booking' }, // Reference to Booking
  user_id: { type: String, required: true, ref: 'User' }, // Reference to User
  action: { type: String, required: true },
  timestamp: { type: Date, required: true },
}, { timestamps: true });


// ------------------------------------------------------------------------------------------------
// MODELS
// ------------------------------------------------------------------------------------------------

// Models for the different booking types
const Booking = (mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)) as Model<IBooking>;
const ServiceProgramBooking = Booking.discriminator<IServiceProgramBooking>('ServiceProgramBooking', ServiceProgramBookingSchema);
const EventBooking = Booking.discriminator<IEventBooking>('EventBooking', EventBookingSchema);

// Models for related entities
const ClientModel = (mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema)) as Model<IClient>;
const VolunteerModel = (mongoose.models.Volunteer || mongoose.model<IVolunteer>('Volunteer', VolunteerSchema)) as Model<IVolunteer>;
const BookingClientRelation = (mongoose.models.BookingClientRelation || mongoose.model<IBookingClientRelation>('BookingClientRelation', BookingClientRelationSchema)) as Model<IBookingClientRelation>;
const BookingVolunteerRelation = (mongoose.models.BookingVolunteerRelation || mongoose.model<IBookingVolunteerRelation>('BookingVolunteerRelation', BookingVolunteerRelationSchema)) as Model<IBookingVolunteerRelation>;
const EventAttendee = (mongoose.models.EventAttendee || mongoose.model<IEventAttendee>('EventAttendee', EventAttendeeSchema)) as Model<IEventAttendee>;
const VolunteerAbsence = (mongoose.models.VolunteerAbsence || mongoose.model<IVolunteerAbsence>('VolunteerAbsence', VolunteerAbsenceSchema)) as Model<IVolunteerAbsence>;
const JobHistory = (mongoose.models.JobHistory || mongoose.model<IJobHistory>('JobHistory', JobHistorySchema)) as Model<IJobHistory>;

export {
  Booking,
  ServiceProgramBooking,
  EventBooking,
  ClientModel,
  VolunteerModel,
  BookingClientRelation,
  BookingVolunteerRelation,
  EventAttendee,
  VolunteerAbsence,
  JobHistory
};
