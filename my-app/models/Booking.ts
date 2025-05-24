import mongoose, { Document, Schema } from 'mongoose';
import { UserRole, ServiceType, ProgramType } from './User'; // Import necessary enums from User.ts

// ------------------------------------------------------------------------------------------------
// ENUMS
// ------------------------------------------------------------------------------------------------

// Enum for Booking Type
export enum BookingType {
  SERVICE = 'Service',
  PROGRAM = 'Program',
  SUPPORT_SERVICE = 'Support Service',
  EVENT = 'Event',
}

// Enum for Booking Status
export enum BookingStatus {
  ASSIGNED = 'Assigned',
  NOT_ASSIGNED = 'Not Assigned',
  CANCELLED = 'Cancelled',
  DELETED = 'Deleted',
  COMPLETED = 'Completed',
}

// Enum for Booking Frequency Type
export enum FrequencyType {
  ONE_TIME = 'One-Time',
  CONTINUOUS = 'Continuous',
  ONGOING = 'Ongoing',
}

// Enum for Cancellation Reason
export enum CancellationReason {
  CLIENT_PROVIDER = 'Client - Provider',
  CLIENT_HEALTH = 'Client - Health',
  CLIENT_OTHER = 'Client - Other',
  VOLUNTEER_HEALTH = 'Volunteer - Health',
  VOLUNTEER_OTHER = 'Volunteer - Other',
  NO_VOLUNTEERS_AVAILABLE = 'No Volunteers Available',
}

// Enum for Recurrence Frequency
export enum RecurrenceFrequency {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  BI_WEEKLY = 'Bi-weekly',
  MONTHLY = 'Monthly',
  ANNUALLY = 'Annually',
}

// Enum for Booking Volunteer Relation Status
export enum BookingVolunteerStatus {
  POSSIBLE = 'Possible',
  LEFT_VOICEMAIL = 'Left Voicemail',
  EMAILED = 'Emailed',
  ASSIGNED = 'Assigned',
  UNAVAILABLE = 'Unavailable',
}

// Enum for Event Attendee User Type
export enum EventAttendeeUserType {
  CLIENT = 'Client',
  VOLUNTEER = 'Volunteer',
  STAFF = 'Staff',
  EXTERNAL = 'External',
}

// ------------------------------------------------------------------------------------------------
// INTERFACES
// ------------------------------------------------------------------------------------------------

// Base Booking Interface
export interface IBooking extends Document {
  booking_id: number;
  booking_type: BookingType;
  status: BookingStatus;
  frequency_type: FrequencyType;
  date: Date;
  start_time: string;
  appointment_time: string;
  appointment_length: number;
  full_duration: number;
  notes?: string;
  num_volunteers_needed: number;
  client_confirmation: boolean;
  cancellation_reason?: CancellationReason | null;
  cancellation_notes?: string | null;
  is_parent_booking: boolean;
  parent_booking_id?: number | null;
  end_date?: Date | null;
  recurrence_frequency?: RecurrenceFrequency | null;
  recurrence_days?: number[] | null;
}

// Service/Program Booking Interface
export interface IServiceProgramBooking extends IBooking {
  service_type: ServiceType | ProgramType | string; // Using string for now to encompass all service/program types from schema
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
  client_id: number;
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
  volunteer_id: number;
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
  client_id: number;
  is_primary: boolean;
}

// Booking Volunteer Relation Interface
export interface IBookingVolunteerRelation extends Document {
  booking_id: number;
  volunteer_id: number;
  status: BookingVolunteerStatus;
}

// Event Attendee Interface
export interface IEventAttendee extends Document {
  event_booking_id: number;
  user_id?: number | null; // Corresponds to user_id in User.ts if internal
  external_name?: string | null;
  user_type: EventAttendeeUserType;
}

// Volunteer Absence Interface
export interface IVolunteerAbsence extends Document {
  absence_id: number;
  volunteer_id: number;
  start_date: Date;
  end_date: Date;
  is_one_day: boolean;
  reason?: string | null;
}

// Job History Interface
export interface IJobHistory extends Document {
  history_id: number;
  booking_id: number;
  user_id: number; // Corresponds to user_id in User.ts
  action: string;
  timestamp: Date;
}

// ------------------------------------------------------------------------------------------------
// SCHEMAS
// ------------------------------------------------------------------------------------------------

// Base Booking Schema
const BookingSchema = new Schema<IBooking>({
  booking_id: { type: Number, required: true, unique: true }, // Assuming booking_id is unique
  booking_type: { type: String, enum: Object.values(BookingType), required: true },
  status: { type: String, enum: Object.values(BookingStatus), required: true },
  frequency_type: { type: String, enum: Object.values(FrequencyType), required: true },
  date: { type: Date, required: true },
  start_time: { type: String, required: true, pattern: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  appointment_time: { type: String, required: true, pattern: /^([01]\d|2[0-3]):([0-5]\d)$/ },
  appointment_length: { type: Number, required: true },
  full_duration: { type: Number, required: true },
  notes: { type: String, minlength: 0, maxlength: 2000 },
  num_volunteers_needed: { type: Number, required: true, min: 1, max: 4, default: 1 },
  client_confirmation: { type: Boolean, required: true },
  cancellation_reason: { type: String, enum: [...Object.values(CancellationReason), null], default: null },
  cancellation_notes: { type: String, default: null },
  is_parent_booking: { type: Boolean, required: true },
  parent_booking_id: { type: Number, default: null },
  end_date: { type: Date, default: null },
  recurrence_frequency: { type: String, enum: [...Object.values(RecurrenceFrequency), null], default: null },
  recurrence_days: { type: [Number], default: null },
}, { timestamps: true });

// Service/Program Booking Schema
const ServiceProgramBookingSchema = new Schema<IServiceProgramBooking>({
  // Inherits from BookingSchema
  service_type: {
    type: String,
    enum: [
      ...Object.values(ServiceType),
      ...Object.values(ProgramType),
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
  pickup_address_description: { type: String, required: true },
  pickup_address_street: { type: String, required: true },
  pickup_address_city: { type: String, required: true },
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
  location_description: { type: String, required: true },
  location_street: { type: String, required: true },
  location_city: { type: String, required: true },
});

// Client Schema (Simplified for booking context, links to User schema)
const ClientSchema = new Schema<IClient>({
  client_id: { type: Number, required: true, unique: true }, // Links to user_id in User.ts
  preferred_name: { type: String, required: true },
  last_name: { type: String, required: true },
  internal_flags: { type: [String], required: true },
  booking_flags: { type: [String], required: true },
  allergies: { type: String },
  mobility_aids: { type: [String] },
  disability: { type: String },
  dnr: { type: Boolean, required: true },
  dnr_notes: { type: String },
  home_phone: { type: String, default: null },
  cell_phone: { type: String, default: null },
  home_address_street: { type: String, required: true },
  home_address_city: { type: String, required: true },
  scent_sensitivity: { type: Boolean, required: true },
  smoking: { type: Boolean, required: true },
  vehicle_requirements: { type: [String] },
}, { _id: false }); // _id: false because client_id is the primary key

// Volunteer Schema (Simplified for booking context, links to User schema)
const VolunteerSchema = new Schema<IVolunteer>({
  volunteer_id: { type: Number, required: true, unique: true }, // Links to user_id in User.ts
  preferred_name: { type: String, required: true },
  last_name: { type: String, required: true },
  flags: { type: [String], required: true },
  allergies: { type: String },
  home_phone: { type: String, default: null },
  cell_phone: { type: String, default: null },
  email: { type: String, required: true },
  car_type: { type: String, default: null },
  scent_sensitivity: { type: Boolean, required: true },
  smoking: { type: Boolean, required: true },
}, { _id: false }); // _id: false because volunteer_id is the primary key

// Booking Client Relation Schema
const BookingClientRelationSchema = new Schema<IBookingClientRelation>({
  booking_id: { type: Number, required: true, ref: 'Booking' }, // Reference to Booking
  client_id: { type: Number, required: true, ref: 'User' }, // Reference to User (Client)
  is_primary: { type: Boolean, required: true },
}, { _id: false });

// Booking Volunteer Relation Schema
const BookingVolunteerRelationSchema = new Schema<IBookingVolunteerRelation>({
  booking_id: { type: Number, required: true, ref: 'Booking' }, // Reference to Booking
  volunteer_id: { type: Number, required: true, ref: 'User' }, // Reference to User (Volunteer)
  status: { type: String, enum: Object.values(BookingVolunteerStatus), required: true },
}, { _id: false });

// Event Attendee Schema
const EventAttendeeSchema = new Schema<IEventAttendee>({
  event_booking_id: { type: Number, required: true, ref: 'EventBooking' }, // Reference to EventBooking
  user_id: { type: Number, default: null, ref: 'User' }, // Reference to User, nullable for external
  external_name: { type: String, default: null },
  user_type: { type: String, enum: Object.values(EventAttendeeUserType), required: true },
});

// Volunteer Absence Schema
const VolunteerAbsenceSchema = new Schema<IVolunteerAbsence>({
  absence_id: { type: Number, required: true, unique: true },
  volunteer_id: { type: Number, required: true, ref: 'User' }, // Reference to User (Volunteer)
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  is_one_day: { type: Boolean, required: true },
  reason: { type: String, default: null },
}, { timestamps: true });

// Job History Schema
const JobHistorySchema = new Schema<IJobHistory>({
  history_id: { type: Number, required: true, unique: true },
  booking_id: { type: Number, required: true, ref: 'Booking' }, // Reference to Booking
  user_id: { type: Number, required: true, ref: 'User' }, // Reference to User
  action: { type: String, required: true },
  timestamp: { type: Date, required: true },
}, { timestamps: true });


// ------------------------------------------------------------------------------------------------
// MODELS
// ------------------------------------------------------------------------------------------------

// Models for the different booking types
export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export const ServiceProgramBooking = Booking.discriminator<IServiceProgramBooking>('ServiceProgramBooking', ServiceProgramBookingSchema);
export const EventBooking = Booking.discriminator<IEventBooking>('EventBooking', EventBookingSchema);

// Models for related entities
export const ClientModel = mongoose.model<IClient>('Client', ClientSchema);
export const VolunteerModel = mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);
export const BookingClientRelation = mongoose.model<IBookingClientRelation>('BookingClientRelation', BookingClientRelationSchema);
export const BookingVolunteerRelation = mongoose.model<IBookingVolunteerRelation>('BookingVolunteerRelation', BookingVolunteerRelationSchema);
export const EventAttendee = mongoose.model<IEventAttendee>('EventAttendee', EventAttendeeSchema);
export const VolunteerAbsence = mongoose.model<IVolunteerAbsence>('VolunteerAbsence', VolunteerAbsenceSchema);
export const JobHistory = mongoose.model<IJobHistory>('JobHistory', JobHistorySchema);