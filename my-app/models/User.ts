import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Enums for various fields
export enum UserRole {
  CLIENT = "Client",
  DONOR = "Donor",
  VOLUNTEER = "Volunteer",
  VOLUNTEER_COORDINATOR = "Volunteer Coordinator",
  STAFF = "Staff",
  ADMIN = "Admin", // Added based on JSON schema structure within Staff
  SUPER_ADMIN = "Super Admin", // Added based on JSON schema structure within Staff
  BOARD = "Board",
  SPP = "SPP", // Social Prescribing Participant - Added based on JSON schema
  EVENT_ATTENDEE = "Event Attendee",
  OTHER = "Other", // Kept from provided TS enums
  // USER = "user", // Removed as it's not listed as a specific role in the JSON schema
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
      {
        type: String,
        enum: Object.values(UserRole),
        default: [UserRole.CLIENT],
      },
    ],
    staff_roles: [String],
    enews_subscription: { type: Boolean, default: false },
    letter_mail_subscription: { type: Boolean, default: false },
    referred_by: { type: String },
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
    gender: { type: String },
    interests: [String],
    skills: [String],
    languages: {
      primary_language: { type: String },
      other_languages: [String],
      notes: String,
    },
    ethnicity: [String],
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
    current_status: { type: String },
    client_start_date: Date,
    internal_flags: [String],
    booking_flags: [String],
    volunteer_exceptions: [String],
    family_involvement: String,
    mobility_aids: [String],
    vehicle_requirements: [String],
    client_services: [
      {
        service_type: { type: String },
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
        program_type: { type: String },
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
    current_status: { type: String },
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
        service_type: { type: String },
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
        program_type: { type: String },
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
        vehicle_type: { type: String },
        number_of_passengers: String,
        accommodations: [String],
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
    current_status: { type: String },
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
  role: { type: String, default: "user" }, // Legacy role field

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
const User = mongoose.model("User", UserSchema);

export default User;
