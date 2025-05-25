// Centralized TypeScript Enum Definitions for Booking-related entities
// These enums are intended to be populated and managed dynamically, potentially via a database like MongoDB.

// Enum for Booking Type
export enum BookingType {
  SERVICE = "Service",
  PROGRAM = "Program",
  SUPPORT_SERVICE = "Support Service",
  EVENT = "Event",
}

// Enum for Booking Status
export enum BookingStatus {
  ASSIGNED = "Assigned",
  NOT_ASSIGNED = "Not Assigned",
  CANCELLED = "Cancelled",
  DELETED = "Deleted",
  COMPLETED = "Completed",
}

// Enum for Booking Frequency Type
export enum FrequencyType {
  ONE_TIME = "One-Time",
  CONTINUOUS = "Continuous",
  ONGOING = "Ongoing",
}

// Enum for Cancellation Reason (Note: JSON schema includes null, handle with `CancellationReason | null` in types)
export enum CancellationReason {
  CLIENT_PROVIDER = "Client - Provider",
  CLIENT_HEALTH = "Client - Health",
  CLIENT_OTHER = "Client - Other",
  VOLUNTEER_HEALTH = "Volunteer - Health",
  VOLUNTEER_OTHER = "Volunteer - Other",
  NO_VOLUNTEERS_AVAILABLE = "No Volunteers Available",
}

// Enum for Recurrence Frequency (Note: JSON schema includes null, handle with `RecurrenceFrequency | null` in types)
export enum RecurrenceFrequency {
  DAILY = "Daily",
  WEEKLY = "Weekly",
  BI_WEEKLY = "Bi-weekly",
  MONTHLY = "Monthly",
  ANNUALLY = "Annually",
}

// Enum for Booking Volunteer Relation Status
export enum BookingVolunteerStatus {
  POSSIBLE = "Possible",
  LEFT_VOICEMAIL = "Left Voicemail",
  EMAILED = "Emailed",
  ASSIGNED = "Assigned",
  UNAVAILABLE = "Unavailable",
}

// Enum for Event Attendee User Type
export enum EventAttendeeUserType {
  CLIENT = "Client",
  VOLUNTEER = "Volunteer",
  STAFF = "Staff",
  EXTERNAL = "External",
}

// Enum for Service or Program Type (Extracted from ServiceProgramBooking.service_type)
export enum ServiceProgramType {
  DRIVES_MEDICAL = "Drives Medical",
  DRIVES_MISCELLANEOUS = "Drives Miscellaneous",
  DRIVES_SHOPPING = "Drives Shopping",
  DRIVES_RECREATION = "Drives Recreation",
  DESTINATION_WALKS = "Destination Walks",
  DOCUMENT_ASSISTANCE = "Document Assistance",
  GARDENING = "Gardening",
  MINOR_HOME_REPAIR = "Minor Home Repair",
  PACKING_AND_SORTING = "Packing and Sorting",
  REASSURANCE_PHONE_CALLS = "Reassurance Phone Calls",
  SOCIAL_PHONE_CALL = "Social Phone Call",
  TECHNOLOGY_SUPPORT = "Technology Support",
  VISITING = "Visiting",
  VISITING_WITH_DRIVE = "Visiting with Drive",
  WALKING = "Walking",
  WALKING_WITH_DRIVE = "Walking with Drive",
  WHEELCHAIR_PUSH = "Wheelchair Push",
  MISCELLANEOUS_SERVICE = "Miscellaneous Service",
  AMBASSADOR = "Ambassador",
  COMPANION_PETS = "Companion Pets",
  CULTURAL_COMPANIONS = "Cultural Companions",
  HOLIDAY_GIFT_EXCHANGE = "Holiday Gift Exchange",
  INCOME_TAX = "Income Tax",
  SILENT_DISCO = "Silent Disco",
  SNOW_ANGELS = "Snow Angels",
  WELCOME_TEAM = "Welcome Team",
  ACCOUNTING = "Accounting",
  BOARD = "Board",
  FUNDRAISING = "Fundraising",
  HELPLINE = "Helpline",
  MARCOMM = "MarComm",
  MISCELLANEOUS_SUPPORT = "Miscellaneous Support",
  TRAINING = "Training",
}

// Create enum registry for internal use
export const BOOKING_ENUM_REGISTRY = {
  BookingType,
  BookingStatus,
  FrequencyType,
  CancellationReason,
  RecurrenceFrequency,
  BookingVolunteerStatus,
  EventAttendeeUserType,
  ServiceProgramType,
} as const;

// Type for enum names
export type BookingEnumName = keyof typeof BOOKING_ENUM_REGISTRY;
