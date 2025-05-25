// Centralized TypeScript Enum Definitions for Booking-related entities

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
