import { Document } from "mongoose";

// Re-exporting enums from User.ts that are needed for typing in bookingController.ts
// This assumes these enums are already exported from the original User.ts
export enum UserRole {
  CLIENT = "Client",
  DONOR = "Donor",
  VOLUNTEER = "Volunteer",
  STAFF = "Staff",
  BOARD = "Board",
  BAH = "BAH",
  EVENT_ATTENDEE = "Event Attendee",
  OTHER = "Other",
  ADMIN = "admin",
  USER = "user",
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

export enum Status {
  ACTIVE = "Active",
  AWAY = "Away",
  INACTIVE = "Inactive",
  NEW = "New",
  PENDING = "Pending",
}


// Define the IUser interface based on the structure of your User.ts schema
// This interface will be used for type-checking Mongoose documents and lean objects
export interface IUser extends Document {
  general_information?: {
    user_id?: string;
    roles?: UserRole[];
    staff_roles?: string[]; // Assuming StaffRole enum is not directly used here
    enews_subscription?: boolean;
    letter_mail_subscription?: boolean;
    referred_by?: string; // Assuming ReferredBy enum is not directly used here
  };
  personal_information?: {
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
    gender?: string; // Assuming Gender enum is not directly used here
    interests?: string[];
    skills?: string[];
    languages?: {
      primary_language?: string; // Assuming Language enum is not directly used here
      other_languages?: string[];
      notes?: string;
    };
    ethnicity?: string[]; // Assuming Ethnicity enum is not directly used here
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
  client_information?: {
    current_status?: Status;
    client_start_date?: Date;
    internal_flags?: string[];
    booking_flags?: string[];
    volunteer_exceptions?: string[];
    family_involvement?: string;
    mobility_aids?: MobilityAid[];
    vehicle_requirements?: VehicleType[];
    client_services?: Array<{
      service_type?: ServiceType;
      service_id?: string;
      is_active?: boolean;
      start_date?: Date;
      end_date?: Date;
      notes?: string;
    }>;
    client_programs?: Array<{
      program_type?: ProgramType;
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
    scent_sensitivity?: boolean;
    smoking?: boolean;
  };
  volunteer_information?: {
    current_status?: Status;
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
      service_type?: ServiceType;
      service_id?: string;
      is_active?: boolean;
      start_date?: Date;
      end_date?: Date;
      notes?: string;
    }>;
    volunteer_programs?: Array<{
      program_type?: ProgramType;
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
        vehicle_type?: VehicleType;
        number_of_passengers?: string;
        accommodations?: MobilityAid[];
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
    scent_sensitivity?: boolean;
    smoking?: boolean;
  };
  donor_information?: {
    current_status?: Status;
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
  password: string;
  role?: "user" | "admin";
  name?: string;
  favorites?: string[]; // Assuming ObjectId is stored as string in lean docs
  watchlist?: string[]; // Assuming ObjectId is stored as string in lean docs
  preferences?: {
    genres?: string[];
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
  };
  // Methods are not typically present on lean documents, so they are omitted here.
  // If you need to call methods, you'd fetch the full Mongoose document.
}
