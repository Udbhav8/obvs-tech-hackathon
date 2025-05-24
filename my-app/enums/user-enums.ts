// This file was generated based on the provided JSON schema and TypeScript enum definitions.

// Centralized TypeScript Enum Definitions
// These enums are intended to be populated and managed dynamically, potentially via a database like MongoDB.



// Possible ways a user was referred to the organization.
export enum ReferredBy {
  TWO_ONE_ONE = "211",
  ADVERTISING = "Advertising",
  FAMILY_FRIEND = "Family/Friend",
  SUPPORT_SERVICE = "Support Service",
  WEB_SEARCH = "Web Search",
  OTHER = "Other",
  UNKNOWN = "Unknown",
}

// Possible gender identities.
export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  NON_BINARY = "Non-binary",
  OTHER = "Other",
}

// A list of languages.
export enum Language {
  ENGLISH = "English",
  FRENCH = "French",
  ARABIC = "Arabic",
  BENGALI = "Bengali",
  BULGARIAN = "Bulgarian",
  CANTONESE = "Cantonese",
  CROATIAN = "Croatian",
  CZECH = "Czech",
  DUTCH = "Dutch",
  GERMAN = "German",
  GREEK = "Greek",
  HEBREW = "Hebrew",
  HINDI = "Hindi",
  IRANIAN = "Iranian",
  ITALIAN = "Italian",
  JAPANESE = "Japanese",
  KOREAN = "Korean",
  MANDARIN = "Mandarin",
  PND = "PND", // Meaning is unclear from the schema ("What is PND?") - Keeping as is.
  PUNJABI = "Punjabi",
  RUSSIAN = "Russian",
  SAMOAN = "Samoan",
  SPANISH = "Spanish",
  SWEDISH = "Swedish",
  TAGALOG = "Tagalog",
  UKRAINIAN = "Ukrainian",
  UNKNOWN = "Unknown",
  URDU = "Urdu",
}

// A list of ethnicities.
export enum Ethnicity {
  ABORIGINAL = "Aboriginal/First Nations/Metis",
  ARAB = "Arab",
  BLACK = "Black",
  CHINESE = "Chinese",
  FILIPINO = "Filipino",
  JAPANESE = "Japanese",
  KOREAN = "Korean",
  LATIN_AMERICAN = "Latin American",
  OTHER = "Other",
  PND = "PND", // Meaning is unclear from the schema - Keeping as is.
  SOUTH_ASIA = "South Asia",
  SOUTHEAST_ASIA = "Southeast Asia",
  UNKNOWN = "Unknown",
  WEST_ASIA = "West Asia",
  WHITE = "White",
}

// Represents the current status of a user in various contexts (Client, Volunteer, Donor, Funder).
export enum Status {
  ACTIVE = "Active",
  AWAY = "Away",
  INACTIVE = "Inactive",
  NEW = "New",
  PENDING = "Pending",
  DECEASED = "Deceased", // Added based on Client status in JSON schema
}

// Represents the status of a specific booking.
export enum BookingStatus {
  ASSIGNED = "Assigned",
  CANCELLED = "Cancelled",
  COMPLETED = "Completed",
  DELETED = "Deleted",
  NOT_ASSIGNED = "Not Assigned",
}

// Types of services provided to clients, often involving volunteers.
export enum ServiceType {
  DESTINATION_WALK = "Destination Walk",
  DOCUMENT_ASSISTANCE = "Document Assistance",
  GARDENING = "Gardening",
  MEDICAL_DRIVE = "Medical Drive",
  MINOR_HOME_REPAIR = "Minor Home Repair",
  MISCELLANEOUS_DRIVE = "Miscellaneous Drive",
  MISCELLANEOUS_SERVICE = "Miscellaneous Service",
  PACKING_AND_SORTING = "Packing and Sorting",
  REASSURANCE_PHONE_CALL = "Reassurance Phone Call",
  RECREATION_DRIVE = "Recreation Drive",
  SHOPPING_DRIVE = "Shopping Drive",
  SOCIAL_PHONE_CALL = "Social Phone Call",
  TECHNOLOGY_SUPPORT = "Technology Support",
  VISITING = "Visiting",
  VISITING_WITH_DRIVE = "Visiting with Drive",
  WALKING = "Walking",
  WALKING_WITH_DRIVE = "Walking with Drive",
  WHEELCHAIR_PUSH = "Wheelchair Push",
}

// Types of programs offered.
export enum ProgramType {
  AMBASSADOR = "Ambassador",
  BETTER_AT_HOME = "Better at Home",
  COMPANION_PETS = "Companion Pets",
  CULTURAL_COMPANIONS = "Cultural Companions",
  HOLIDAY_GIFT_EXCHANGE = "Holiday Gift Exchange",
  INCOME_TAX = "Income Tax",
  SILENT_DISCO = "Silent Disco",
  SNOW_ANGELS = "Snow Angels",
  WELCOME_TEAM = "Welcome Team",
}

// Types of mobility aids used by clients or that volunteers might need to accommodate.
export enum MobilityAid {
  CANE = "Cane",
  WALKING_POLES = "Walking Poles",
  WALKER = "Walker",
  WHEELCHAIR = "Wheelchair",
}

// Types of vehicles volunteers might use for drives.
export enum VehicleType {
  COUPE = "Coupe",
  SEDAN = "Sedan",
  CROSSOVER = "Crossover",
  SUV = "SUV",
  MINIVAN = "Minivan",
  VAN = "Van",
  TRUCK = "Truck",
}

// Frequency of a booking.
export enum BookingFrequency {
  ONE_TIME = "One-Time",
  ONGOING = "Ongoing",
  RECURRING = "Recurring",
}

// Types of living arrangements for clients.
export enum LivingArrangementType {
  LIVES_ALONE_APT_CONDO = "Lives Alone in Apartment/Condo",
  LIVES_ALONE_HOUSE = "Lives Alone in House",
  LIVES_COMMUNALLY_LOW_INCOME = "Lives Communally in Low-Income Housing Facility",
  LIVES_COMMUNALLY_SENIORS = "Lives Communally in Seniors’ Retirement Facility",
  LIVES_WITH_ROOMMATE_PARTNER_HOUSE = "Lives with a Roommate/Partner in House",
  LIVES_WITH_ROOMMATE_PARTNER_APT_CONDO = "Lives with a Roommate/Partner in Apartment/Condo",
}

// Types of support services a client might be receiving from elsewhere.
export enum ClientSupportServiceType {
  BETTER_AT_HOME_HOUSEKEEPING = "Better at Home Housekeeping",
  ISLAND_HEALTH_SUPPORT = "Island Health Support",
  PRIVATE_CAREGIVING = "Private Caregiving",
  PRIVATE_HOUSEKEEPING = "Private Housekeeping",
  RETURN_TO_HEALTH = "Return to Health",
}

// Types of structured programs a client might attend.
export enum StructuredProgramType {
  ADULT_DAY_PROGRAM = "Adult Day Program",
  RECREATION_CENTRE = "Recreation Centre",
  SENIORS_CENTRE = "Seniors’ Centre",
}

// Categories used to classify bookings.
export enum BookingTypeCategory {
  CLIENT_SERVICE = "Client Service",
  CLIENT_PROGRAM = "Client Program",
  CLIENT_SUPPORT_SERVICE = "Client Support Service",
  CLIENT_STRUCTURED_PROGRAM = "Client Structured Program",
}

// Types of support services volunteers might provide within the organization.
export enum VolunteerSupportServiceType {
  ACCOUNTING = "Accounting",
  BOARD = "Board", // Note: This value is also present in UserRole, context is important.
  MARCOMM = "MarComm",
  FUNDRAISING = "Fundraising",
  EVENTS = "Events",
  MISCELLANEOUS_SUPPORT = "Miscellaneous Support",
  HELPLINE = "Helpline",
}

// Possible sources/types of donations for Funders.
export enum FunderDonationType {
  CHEQUE = "Cheque",
  CASH = "Cash",
  CANADA_HELPS = "CanadaHelps",
  IN_KIND = "In-Kind",
}

// Types of events an attendee might be contacted for.
export enum EventContactType {
  SILENT_DISCO = "Silent Disco",
  SYMPHONY = "Symphony",
}

// Possible types of health conditions.
export enum HealthConditionType {
  ASTHMA = "Asthma",
  ARTHRITIS = "Arthritis",
  BACK_PROBLEMS = "Back Problems",
  BRAIN_INJURY = "Brain Injury",
  BROKEN_HIP = "Broken Hip",
  CANCER = "Cancer",
  CHRONIC_PAIN = "Chronic Pain",
  COPD = "COPD",
  DEMENTIA_MEMORY_LOSS = "Dementia or Memory Loss",
  DIABETES = "Diabetes",
  DIZZINESS_VERTIGO = "Dizziness/Vertigo",
  HEART_CONDITION = "Heart Condition",
  MENTAL_HEALTH = "Mental Health",
  MULTIPLE_SCLEROSIS = "Multiple Sclerosis",
  OSTEOPOROSIS = "Osteoporosis",
  PARKINSONS = "Parkinsons",
  SEIZURES = "Seizures",
  STROKE = "Stroke",
  SYNCOPE = "Syncope (Fainting Disorder)",
  OTHER = "Other",
}

// Possible types of accessibility needs.
export enum AccessibilityNeedType {
  BLIND = "Blind",
  VISION_LOSS = "Vision Loss",
  DEAF = "Deaf",
  HEARING_LOSS = "Hearing Loss",
  IMMUNOCOMPROMISED_MASK = "Immunocompromised - Requests that you wear a mask",
  INTELLECTUAL_DEVELOPMENTAL_DISABILITY = "Intellectual or Developmental Disability",
  SCENT_SENSITIVE = "Scent Sensitive",
  SOUND_SENSITIVE = "Sound Sensitive",
  OTHER = "Other",
}

// Referred by options specific to the Better at Home program.
export enum BahReferredBy {
  AD = "Ad",
  BAH_HOST_ORGANIZATION = "BaH Host Organization",
  COMMUNITY_HEALTH_WORKER_NURSE_HA = "Community Health Worker / Nurse (HA)",
  DOCTOR = "Doctor",
  FAMILY_FRIEND = "Family/Friend",
  GROUP = "Group",
  OTHER = "Other",
  UNKNOWN = "Unknown",
}

// Utility type to convert enum to array of values (Provided in original TS)
export type EnumValues<T> = T[keyof T][];

// Helper function to get enum values as array (Provided in original TS)
export function getEnumValues<T extends Record<string, string>>(
  enumObject: T
): string[] {
  return Object.values(enumObject);
}

// Helper function to get enum keys as array (Provided in original TS)
export function getEnumKeys<T extends Record<string, string>>(
  enumObject: T
): (keyof T)[] {
  return Object.keys(enumObject) as (keyof T)[];
}

// Enum registry for easy iteration and management (Updated to include all new enums)
export const ENUM_REGISTRY = {
  ReferredBy,
  Gender,
  Language,
  Ethnicity,
  Status,
  BookingStatus,
  ServiceType,
  ProgramType,
  MobilityAid,
  VehicleType,
  BookingFrequency,
  LivingArrangementType,
  ClientSupportServiceType,
  StructuredProgramType,
  BookingTypeCategory,
  VolunteerSupportServiceType,
  FunderDonationType,
  EventContactType,
  HealthConditionType,
  AccessibilityNeedType,
  BahReferredBy,
} as const;

export type EnumName = keyof typeof ENUM_REGISTRY;
