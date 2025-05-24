import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Enums for various fields
// Represents the high-level roles a user can have.
export enum UserRole {
  CLIENT = "Client",
  DONOR = "Donor",
  VOLUNTEER = "Volunteer",
  VOLUNTEER_COORDINATOR = "Volunteer Coordinator",
  STAFF = "Staff",
  ADMIN = "admin", // Added based on JSON schema structure within Staff
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

// TypeScript interface for User document
interface IUser extends Document {
  // General Information
  general_information?: {
    user_id?: string;
    roles?: string[];
    staff_roles?: string[];
    enews_subscription?: boolean;
    letter_mail_subscription?: boolean;
    referred_by?: string;
  };

  // Personal Information
  personal_information: {
    first_name: string;
    preferred_name?: string;
    last_name: string;
    email: string;
    cell_phone?: string;
    home_phone?: string;
    date_of_birth?: Date;
    home_address?: {
      street_address?: string;
      city?: string;
      province?: string;
      country?: string;
      postal_code?: string;
    };
    gender?: string;
    interests?: string[];
    skills?: string[];
    languages?: {
      primary_language?: string;
      other_languages?: string[];
      notes?: string;
    };
    ethnicity?: string[];
    spouse_partner?: {
      id?: string;
      name?: string;
    };
    emergency_contacts?: Array<{
      emergency_contact_id?: string;
      name?: string;
      relationship?: string;
      home_phone?: string;
      cell_phone?: string;
      work_phone?: string;
      email?: string;
      notes?: string;
    }>;
  };

  // Health Information
  health_information?: {
    allergies?: string[];
    dnr?: boolean;
    dnr_notes?: string;
    smoker?: boolean;
    health_conditions?: Array<{
      health_condition_id?: string;
      health_condition_type?: string;
      notes?: string;
    }>;
    accessibility_needs?: Array<{
      accessibility_need_id?: string;
      accessibility_need_type?: string;
      notes?: string;
    }>;
  };

  // Client Information
  client_information?: {
    current_status?: string;
    client_start_date?: Date;
    internal_flags?: string[];
    booking_flags?: string[];
    volunteer_exceptions?: string[];
    family_involvement?: string;
    mobility_aids?: string[];
    vehicle_requirements?: string[];
    client_services?: Array<{
      service_type?: string;
      service_id?: string;
      is_active?: boolean;
      start_date?: Date;
      end_date?: Date;
      notes?: string;
    }>;
    client_programs?: Array<{
      program_type?: string;
      program_id?: string;
      is_active?: boolean;
      start_date?: Date;
      end_date?: Date;
      notes?: string;
    }>;
    client_notes?: Array<{
      date?: Date;
      author?: string;
      note?: string;
    }>;
  };

  // Volunteer Information
  volunteer_information?: {
    current_status?: string;
    volunteer_intake_date?: Date;
    volunteer_orientation_date?: Date;
    volunteer_start_date?: Date;
    volunteer_end_date?: Date;
    volunteer_experience?: string;
    work_experience?: string;
    education?: string;
    internal_flags?: string[];
    booking_flags?: string[];
    client_exceptions?: string[];
    volunteer_services?: Array<{
      service_type?: string;
      service_id?: string;
      is_active?: boolean;
      start_date?: Date;
      end_date?: Date;
      notes?: string;
    }>;
    volunteer_programs?: Array<{
      program_type?: string;
      program_id?: string;
      is_active?: boolean;
      start_date?: Date;
      end_date?: Date;
      notes?: string;
    }>;
    volunteer_availability?: {
      Monday?: { start_time?: string; end_time?: string };
      Tuesday?: { start_time?: string; end_time?: string };
      Wednesday?: { start_time?: string; end_time?: string };
      Thursday?: { start_time?: string; end_time?: string };
      Friday?: { start_time?: string; end_time?: string };
      Saturday?: { start_time?: string; end_time?: string };
      Sunday?: { start_time?: string; end_time?: string };
    };
    volunteer_driving_information?: {
      accessible_parking_permit?: {
        parking_permit?: boolean;
        parking_permit_number?: string;
        parking_permit_expiry_date?: Date;
      };
      drivers_license_number?: string;
      drivers_abstract?: {
        completion_date?: Date;
        expiration_date?: Date;
        notes?: string;
      };
      vehicle_information?: {
        vehicle_make?: string;
        vehicle_model?: string;
        vehicle_year?: string;
        vehicle_type?: string;
        number_of_passengers?: string;
        accommodations?: string[];
      };
    };
    security_clearance?: {
      completion_date?: Date;
      expiration_date?: Date;
      notes?: string;
    };
    references?: Array<{
      first_name?: string;
      last_name?: string;
      relationship?: string;
      email?: string;
      cell_phone?: string;
      home_phone?: string;
      work_phone?: string;
      notes?: string;
      reference_check_completed_date?: Date;
      reference_check_completed_by?: string;
    }>;
    volunteer_notes?: Array<{
      date?: Date;
      author?: string;
      note?: string;
    }>;
  };

  // Donor Information
  donor_information?: {
    current_status?: string;
    active_engagement?: boolean;
    monthly_donor?: boolean;
    monthly_amount?: string;
    donations?: Array<{
      donation_date?: Date;
      processed_date?: Date;
      donation_type?: string[];
      donation_amount?: string;
      donation_value_advantage?: string;
      donation_eligible_amount?: string;
      donation_receipt?: boolean;
    }>;
    donor_notes?: Array<{
      date?: Date;
      author?: string;
      note?: string;
    }>;
  };

  // Authentication fields
  password: string;
  role?: string;

  // Legacy fields
  name?: string;
  favorites?: mongoose.Types.ObjectId[];
  watchlist?: mongoose.Types.ObjectId[];
  preferences?: {
    genres?: string[];
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
  };

  // Methods
  matchPassword(enteredPassword: string): Promise<boolean>;
  isAdmin(): boolean;
  getDisplayName(): string;
  getPrimaryEmail(): string;
}

// Create indexes
UserSchema.index({ "personal_information.email": 1 });

// Export the model using the pattern from the GitHub issue to prevent "Cannot overwrite model once compiled" error
const User = (mongoose.models.User ||
  mongoose.model("User", UserSchema)) as Model<IUser>;

export default User;
