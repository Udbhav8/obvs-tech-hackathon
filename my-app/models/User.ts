import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Enums for various fields
export enum UserRole {
  CLIENT = "Client",
  DONOR = "Donor",
  VOLUNTEER = "Volunteer",
  STAFF = "Staff",
  BOARD = "Board",
  BAH = "BAH",
  EVENT_ATTENDEE = "Event Attendee",
  OTHER = "Other",
  ADMIN = "admin", // Keep existing admin role
  USER = "user", // Keep existing user role
}

export enum StaffRole {
  VOLUNTEER_COORDINATOR = "Volunteer Coordinator",
  ADMIN = "Admin",
}

export enum ReferredBy {
  TWO_ONE_ONE = "211",
  ADVERTISING = "Advertising",
  FAMILY_FRIEND = "Family/Friend",
  SUPPORT_SERVICE = "Support Service",
  WEB_SEARCH = "Web Search",
  OTHER = "Other",
  UNKNOWN = "Unknown",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  NON_BINARY = "Non-binary",
  OTHER = "Other",
}

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
  PND = "PND",
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
  PND = "PND",
  SOUTH_ASIA = "South Asia",
  SOUTHEAST_ASIA = "Southeast Asia",
  UNKNOWN = "Unknown",
  WEST_ASIA = "West Asia",
  WHITE = "White",
}

export enum Status {
  ACTIVE = "Active",
  AWAY = "Away",
  INACTIVE = "Inactive",
  NEW = "New",
  PENDING = "Pending",
}

export enum BookingStatus {
  ASSIGNED = "Assigned",
  CANCELLED = "Cancelled",
  COMPLETED = "Completed",
  DELETED = "Deleted",
  NOT_ASSIGNED = "Not Assigned",
}

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

export enum MobilityAid {
  CANE = "Cane",
  WALKING_POLES = "Walking Poles",
  WALKER = "Walker",
  WHEELCHAIR = "Wheelchair",
}

export enum VehicleType {
  COUPE = "Coupe",
  SEDAN = "Sedan",
  CROSSOVER = "Crossover",
  SUV = "SUV",
  MINIVAN = "Minivan",
  VAN = "Van",
  TRUCK = "Truck",
}

export enum BookingFrequency {
  ONE_TIME = "One-Time",
  ONGOING = "Ongoing",
  RECURRING = "Recurring",
}

// Define the schema using Mongoose's automatic type inference
const userSchemaDefinition = {
  // General Information
  general_information: {
    user_id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    roles: [
      { type: String, enum: Object.values(UserRole), default: [UserRole.USER] },
    ],
    staff_roles: [{ type: String, enum: Object.values(StaffRole) }],
    enews_subscription: { type: Boolean, default: false },
    letter_mail_subscription: { type: Boolean, default: false },
    referred_by: { type: String, enum: Object.values(ReferredBy) },
  },

  // Personal Information
  personal_information: {
    first_name: { type: String, required: true },
    preferred_name: String,
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cell_phone: String,
    home_phone: String,
    date_of_birth: Date,
    home_address: {
      street_address: String,
      city: String,
      province: String,
      country: String,
      postal_code: String,
    },
    gender: { type: String, enum: Object.values(Gender) },
    interests: [String],
    skills: [String],
    languages: {
      primary_language: { type: String, enum: Object.values(Language) },
      other_languages: [{ type: String, enum: Object.values(Language) }],
      notes: String,
    },
    ethnicity: [{ type: String, enum: Object.values(Ethnicity) }],
    spouse_partner: {
      id: String,
      name: String,
    },
    emergency_contacts: [
      {
        emergency_contact_id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        name: String,
        relationship: String,
        home_phone: String,
        cell_phone: String,
        work_phone: String,
        email: String,
        notes: String,
      },
    ],
  },

  // Health Information
  health_information: {
    allergies: [String],
    dnr: Boolean,
    dnr_notes: String,
    smoker: Boolean,
    health_conditions: [
      {
        health_condition_id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        health_condition_type: String,
        notes: String,
      },
    ],
    accessibility_needs: [
      {
        accessibility_need_id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        accessibility_need_type: String,
        notes: String,
      },
    ],
  },

  // Client Information
  client_information: {
    current_status: { type: String, enum: Object.values(Status) },
    client_start_date: Date,
    internal_flags: [String],
    booking_flags: [String],
    volunteer_exceptions: [String],
    family_involvement: String,
    mobility_aids: [{ type: String, enum: Object.values(MobilityAid) }],
    vehicle_requirements: [{ type: String, enum: Object.values(VehicleType) }],
    client_services: [
      {
        service_type: { type: String, enum: Object.values(ServiceType) },
        service_id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        is_active: { type: Boolean, default: true },
        start_date: Date,
        end_date: Date,
        notes: String,
      },
    ],
    client_programs: [
      {
        program_type: { type: String, enum: Object.values(ProgramType) },
        program_id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        is_active: { type: Boolean, default: true },
        start_date: Date,
        end_date: Date,
        notes: String,
      },
    ],
    client_notes: [
      {
        date: { type: Date, default: Date.now },
        author: String,
        note: String,
      },
    ],
  },

  // Volunteer Information
  volunteer_information: {
    current_status: { type: String, enum: Object.values(Status) },
    volunteer_intake_date: Date,
    volunteer_orientation_date: Date,
    volunteer_start_date: Date,
    volunteer_end_date: Date,
    volunteer_experience: String,
    work_experience: String,
    education: String,
    internal_flags: [String],
    booking_flags: [String],
    client_exceptions: [String],
    volunteer_services: [
      {
        service_type: { type: String, enum: Object.values(ServiceType) },
        service_id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        is_active: { type: Boolean, default: true },
        start_date: Date,
        end_date: Date,
        notes: String,
      },
    ],
    volunteer_programs: [
      {
        program_type: { type: String, enum: Object.values(ProgramType) },
        program_id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        is_active: { type: Boolean, default: true },
        start_date: Date,
        end_date: Date,
        notes: String,
      },
    ],
    volunteer_availability: {
      Monday: { start_time: String, end_time: String },
      Tuesday: { start_time: String, end_time: String },
      Wednesday: { start_time: String, end_time: String },
      Thursday: { start_time: String, end_time: String },
      Friday: { start_time: String, end_time: String },
      Saturday: { start_time: String, end_time: String },
      Sunday: { start_time: String, end_time: String },
    },
    volunteer_driving_information: {
      accessible_parking_permit: {
        parking_permit: Boolean,
        parking_permit_number: String,
        parking_permit_expiry_date: Date,
      },
      drivers_license_number: String,
      drivers_abstract: {
        completion_date: Date,
        expiration_date: Date,
        notes: String,
      },
      vehicle_information: {
        vehicle_make: String,
        vehicle_model: String,
        vehicle_year: String,
        vehicle_type: { type: String, enum: Object.values(VehicleType) },
        number_of_passengers: String,
        accommodations: [{ type: String, enum: Object.values(MobilityAid) }],
      },
    },
    security_clearance: {
      completion_date: Date,
      expiration_date: Date,
      notes: String,
    },
    references: [
      {
        first_name: String,
        last_name: String,
        relationship: String,
        email: String,
        cell_phone: String,
        home_phone: String,
        work_phone: String,
        notes: String,
        reference_check_completed_date: Date,
        reference_check_completed_by: String,
      },
    ],
    volunteer_notes: [
      {
        date: { type: Date, default: Date.now },
        author: String,
        note: String,
      },
    ],
  },

  // Donor Information
  donor_information: {
    current_status: { type: String, enum: [Status.ACTIVE, Status.INACTIVE] },
    active_engagement: Boolean,
    monthly_donor: Boolean,
    monthly_amount: String,
    donations: [
      {
        donation_date: Date,
        processed_date: Date,
        donation_type: [String],
        donation_amount: String,
        donation_value_advantage: String,
        donation_eligible_amount: String,
        donation_receipt: Boolean,
      },
    ],
    donor_notes: [
      {
        date: { type: Date, default: Date.now },
        author: String,
        note: String,
      },
    ],
  },

  // Authentication fields (keep existing for compatibility)
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Legacy role field

  // Legacy fields for backward compatibility
  name: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  preferences: {
    genres: [String],
    notifications: {
      email: Boolean,
      push: Boolean,
    },
  },
} as const;

const UserSchema = new mongoose.Schema(userSchemaDefinition, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if user is admin
UserSchema.methods.isAdmin = function (): boolean {
  return (
    this.role === "admin" ||
    this.general_information?.roles?.includes(UserRole.ADMIN)
  );
};

// Get display name
UserSchema.methods.getDisplayName = function (): string {
  if (
    this.personal_information?.first_name &&
    this.personal_information?.last_name
  ) {
    const preferred = this.personal_information.preferred_name;
    const first = preferred || this.personal_information.first_name;
    return `${first} ${this.personal_information.last_name}`;
  }
  return this.name || this.personal_information?.first_name || "Unknown User";
};

// Get primary email
UserSchema.methods.getPrimaryEmail = function (): string {
  return this.personal_information?.email || this.email || "";
};

// Create indexes
UserSchema.index({ "personal_information.email": 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ "general_information.roles": 1 });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
