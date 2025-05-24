const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

// Define enums
const roles = ['Client', 'Donor', 'Volunteer', 'Staff', 'Board', 'BAH', 'Event Attendee', 'Other'];

const staffRoles = ['Volunteer Coordinator', 'Admin'];

const referredBy = ['211', 'Advertising', 'Family/Friend', 'Support Service', 'Web Search', 'Other', 'Unknown'];

const genders = ['Male', 'Female', 'Non-binary', 'Other'];

const languages = [
  'English',
  'French',
  'Arabic',
  'Bengali',
  'Bulgarian',
  'Cantonese',
  'Croatian',
  'Czech',
  'Dutch',
  'German',
  'Greek',
  'Hebrew',
  'Hindi',
  'Iranian',
  'Italian',
  'Japanese',
  'Korean',
  'Mandarin',
  'PND',
  'Punjabi',
  'Russian',
  'Samoan',
  'Spanish',
  'Swedish',
  'Tagalog',
  'Ukranian',
  'Unknown',
  'Urdu',
];

const ethnicities = [
  'Aboriginal/First Nations/Metis',
  'Arab',
  'Black',
  'Chinese',
  'Filipino',
  'Japanese',
  'Korean',
  'Latin American',
  'Other',
  'PND',
  'South Asia',
  'Southeast Asia',
  'Unknown',
  'West Asia',
  'White',
];

const healthConditionTypes = [
  'Asthma',
  'Arthritis',
  'Back Problems',
  'Brain Injury',
  'Broken Hip',
  'Cancer',
  'Chronic Pain',
  'COPD',
  'Dementia or Memory Loss',
  'Diabetes',
  'Dizziness/Vertigo',
  'Heart Condition',
  'Mental Health',
  'Multiple Sclerosis',
  'Osteoporosis',
  'Parkinsons',
  'Seizures',
  'Stroke',
  'Syncope (Fainting Disorder)',
  'Other',
];

const accessibilityNeedTypes = [
  'Blind',
  'Vision Loss',
  'Deaf',
  'Hearing Loss',
  'Immunocompromised - Requests that you wear a mask',
  'Intellectual or Developmental Disability',
  'Scent Sensitive',
  'Sound Sensitive',
  'Other',
];

const statusTypes = ['Active', 'Away', 'Inactive', 'New', 'Pending'];

const mobilityAids = ['Cane', 'Walking Poles', 'Walker', 'Wheelchair'];

const vehicleTypes = ['Coupe', 'Sedan', 'Crossover', 'SUV', 'Minivan', 'Van', 'Truck'];

const livingArrangementTypes = [
  'Lives Alone in Apartment/Condo',
  'Lives Alone in House',
  'Lives Communally in Low-Income Housing Facility',
  "Lives Communally in Seniors' Retirement Facility",
  'Lives with a Roommate/Partner in House',
  'Lives with a Roommate/Partner in Apartment/Condo',
];

const serviceTypes = [
  'Destination Walk',
  'Document Assistance',
  'Gardening',
  'Medical Drive',
  'Minor Home Repair',
  'Miscellaneous Drive',
  'Miscellaneous Service',
  'Packing and Sorting',
  'Reassurance Phone Call',
  'Recreation Drive',
  'Shopping Drive',
  'Social Phone Call',
  'Technology Support',
  'Visiting',
  'Visiting with Drive',
  'Walking',
  'Walking with Drive',
  'Wheelchair Push',
];

const programTypes = [
  'Ambassador',
  'Better at Home',
  'Companion Pets',
  'Cultural Companions',
  'Holiday Gift Exchange',
  'Income Tax',
  'Silent Disco',
  'Snow Angels',
  'Welcome Team',
];

const clientSupportServiceTypes = [
  'Better at Home Housekeeping',
  'Island Health Support',
  'Private Caregiving',
  'Private Housekeeping',
  'Return to Health',
];

const volunteerSupportServiceTypes = [
  'Accounting',
  'Board',
  'MarComm',
  'Fundraising',
  'Events',
  'Miscellaneous Support',
  'Helpline',
];

const structuredProgramTypes = ['Adult Day Program', 'Recreation Centre', "Seniors' Centre"];

const bookingStatuses = ['Assigned', 'Cancelled', 'Completed', 'Deleted', 'Not Assigned'];

const bookingTypeCategories = ['Client Service', 'Client Program', 'Client Support Service', 'Client Structured Program'];

const frequencyTypes = ['One-Time', 'Ongoing', 'Recurring'];

const bahReferredBy = [
  'Ad',
  'BaH Host Organization',
  'Community Health Worker / Nurse (HA)',
  'Doctor',
  'Family/Friend',
  'Group',
  'Other',
  'Unknown',
];

const contactForEvents = ['Silent Disco', 'Symphony'];

// Address schema
const addressSchema = {
  street_address: { type: String, trim: true },
  city: { type: String, trim: true },
  province: { type: String, trim: true },
  country: { type: String, trim: true },
  postal_code: { type: String, trim: true },
};

// Emergency contact schema
const emergencyContactSchema = {
  emergency_contact_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  name: { type: String, trim: true },
  relationship: { type: String, trim: true },
  home_phone: { type: String, trim: true },
  cell_phone: { type: String, trim: true },
  work_phone: { type: String, trim: true },
  email: {
    type: String,
    trim: true,
    validate(value) {
      if (value && !validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  notes: { type: String, trim: true },
};

// Health condition schema
const healthConditionSchema = {
  health_condition_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  health_condition_type: [{ type: String, enum: healthConditionTypes }],
  notes: { type: String, trim: true },
};

// Accessibility need schema
const accessibilityNeedSchema = {
  accessibility_need_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  accessibility_need_type: [{ type: String, enum: accessibilityNeedTypes }],
  notes: { type: String, trim: true },
};

// Living arrangement schema
const livingArrangementSchema = {
  living_arrangement_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  arrangement_type: [{ type: String, enum: livingArrangementTypes }],
  lives_with_contact_id: { type: mongoose.Schema.Types.ObjectId },
  notes: { type: String, trim: true },
};

// Service schema
const serviceSchema = {
  service_type: [{ type: String, enum: serviceTypes }],
  service_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  is_active: { type: Boolean, default: true },
  start_date: [{ type: Date }],
  end_date: [{ type: Date }],
  notes: { type: String, trim: true },
};

// Program schema
const programSchema = {
  program_type: [{ type: String, enum: programTypes }],
  program_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  is_active: { type: Boolean, default: true },
  start_date: [{ type: Date }],
  end_date: [{ type: Date }],
  notes: { type: String, trim: true },
  // Better at Home specific fields
  referral_date: { type: Date },
  intake_date: { type: Date },
  referred_by: [{ type: String, enum: bahReferredBy }],
  receiving_other_publically_funded_home_support: { type: Boolean },
};

// Support service schema
const supportServiceSchema = {
  support_service_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  is_active: { type: Boolean, default: true },
  start_date: [{ type: Date }],
  end_date: [{ type: Date }],
  notes: { type: String, trim: true },
};

// Client support service schema
const clientSupportServiceSchema = {
  ...supportServiceSchema,
  support_service_type: [{ type: String, enum: clientSupportServiceTypes }],
};

// Volunteer support service schema
const volunteerSupportServiceSchema = {
  ...supportServiceSchema,
  support_service_type: [{ type: String, enum: volunteerSupportServiceTypes }],
};

// Structured program schema
const structuredProgramSchema = {
  structured_program_type: [{ type: String, enum: structuredProgramTypes }],
  structured_program_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  is_active: { type: Boolean, default: true },
  start_date: [{ type: Date }],
  end_date: [{ type: Date }],
  notes: { type: String, trim: true },
};

// Booking schema
const bookingSchema = {
  status: [{ type: String, enum: bookingStatuses }],
  booking_number: { type: String, trim: true },
  volunteer_id: { type: mongoose.Schema.Types.ObjectId },
  client_id: { type: mongoose.Schema.Types.ObjectId },
  booking_type_category: [{ type: String, enum: bookingTypeCategories }],
  booking_type: [{ type: String }],
  frequency: [{ type: String, enum: frequencyTypes }],
  booking_date: { type: Date },
  booking_start_time: { type: String, trim: true },
  booking_duration_hrs: { type: String, trim: true },
  booking_pickup_address: addressSchema,
  booking_destination_address: addressSchema,
  booking_history: [{ type: String, trim: true }],
  booking_event_name: { type: String, trim: true },
};

// File schema
const fileSchema = {
  file_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  file_name: { type: String, trim: true },
  file_type: { type: String, trim: true },
  file_path: { type: String, trim: true },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId },
  upload_date: { type: Date, default: Date.now },
  description: { type: String, trim: true },
};

// Note schema
const noteSchema = {
  date: { type: Date, default: Date.now },
  author: { type: String, trim: true },
  note: { type: String, trim: true },
};

// Reference schema
const referenceSchema = {
  first_name: { type: String, trim: true },
  last_name: { type: String, trim: true },
  relationship: { type: String, trim: true },
  email: {
    type: String,
    trim: true,
    validate(value) {
      if (value && !validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  cell_phone: { type: String, trim: true },
  home_phone: { type: String, trim: true },
  work_phone: { type: String, trim: true },
  notes: { type: String, trim: true },
  reference_check_completed_date: { type: Date },
  reference_check_completed_by: { type: String, trim: true },
};

// Donation schema
const donationSchema = {
  donation_date: { type: Date },
  processed_date: { type: Date },
  donation_type: [{ type: String, trim: true }],
  donation_amount: { type: String, trim: true },
  donation_value_advantage: { type: String, trim: true },
  donation_eligible_amount: { type: String, trim: true },
  donation_receipt: { type: Boolean },
};

// Main user schema
const userSchema = mongoose.Schema(
  {
    // Legacy fields for backward compatibility
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value && !validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (value && (!value.match(/\d/) || !value.match(/[a-zA-Z]/))) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'Client',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // General Information
    general_information: {
      user_id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      roles: [
        {
          type: String,
          enum: roles,
        },
      ],
      staff_roles: [
        {
          type: String,
          enum: staffRoles,
        },
      ],
      enews_subscription: { type: Boolean, default: false },
      letter_mail_subscription: { type: Boolean, default: false },
      referred_by: [{ type: String, enum: referredBy }],
    },

    // Personal Information
    personal_information: {
      first_name: { type: String, trim: true },
      preferred_name: { type: String, trim: true },
      last_name: { type: String, trim: true },
      email: {
        type: String,
        trim: true,
        validate(value) {
          if (value && !validator.isEmail(value)) {
            throw new Error('Invalid email');
          }
        },
      },
      cell_phone: { type: String, trim: true },
      home_phone: { type: String, trim: true },
      date_of_birth: { type: Date },
      home_address: addressSchema,
      gender: [{ type: String, enum: genders }],
      interests: [{ type: String, trim: true }],
      skills: [{ type: String, trim: true }],
      languages: {
        primary_language: [{ type: String, enum: languages }],
        other_languages: [{ type: String, enum: languages }],
        notes: { type: String, trim: true },
      },
      ethnicity: [{ type: String, enum: ethnicities }],
      spouse_partner: {
        id: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String, trim: true },
      },
      emergency_contacts: [emergencyContactSchema],
    },

    // Health Information
    health_information: {
      allergies: [{ type: String, trim: true }],
      dnr: { type: Boolean },
      dnr_notes: { type: String, trim: true },
      smoker: { type: Boolean },
      health_conditions: healthConditionSchema,
      accessibility_needs: accessibilityNeedSchema,
    },

    // Client Information
    client_information: {
      current_status: [{ type: String, enum: statusTypes }],
      client_start_date: { type: Date },
      internal_flags: [{ type: String, trim: true }],
      booking_flags: [{ type: String, trim: true }],
      volunteer_exceptions: [{ type: String, trim: true }],
      family_involvement: { type: String, trim: true },
      mobility_aids: [{ type: String, enum: mobilityAids }],
      vehicle_requirements: [{ type: String, enum: vehicleTypes }],
      client_living_arrangements: livingArrangementSchema,
      client_services: [serviceSchema],
      client_programs: programSchema,
      client_support_services: clientSupportServiceSchema,
      client_structured_programs: structuredProgramSchema,
      client_bookings: [bookingSchema],
      client_files: fileSchema,
      client_notes: [noteSchema],
    },

    // Volunteer Information
    volunteer_information: {
      current_status: [{ type: String, enum: statusTypes }],
      volunteer_intake_date: { type: Date },
      volunteer_orientation_date: { type: Date },
      volunteer_start_date: { type: Date },
      volunteer_end_date: { type: Date },
      volunteer_experience: { type: String, trim: true },
      work_experience: { type: String, trim: true },
      education: { type: String, trim: true },
      internal_flags: [{ type: String, trim: true }],
      booking_flags: [{ type: String, trim: true }],
      client_exceptions: [{ type: String, trim: true }],
      volunteer_services: serviceSchema,
      volunteer_programs: programSchema,
      volunteer_support_services: volunteerSupportServiceSchema,
      volunteer_availability: {
        Monday: {
          start_time: [{ type: String, trim: true }],
          end_time: [{ type: String, trim: true }],
        },
        Tuesday: {
          start_time: [{ type: String, trim: true }],
          end_time: [{ type: String, trim: true }],
        },
        Wednesday: {
          start_time: [{ type: String, trim: true }],
          end_time: [{ type: String, trim: true }],
        },
        Thursday: {
          start_time: [{ type: String, trim: true }],
          end_time: [{ type: String, trim: true }],
        },
        Friday: {
          start_time: [{ type: String, trim: true }],
          end_time: [{ type: String, trim: true }],
        },
        Saturday: {
          start_time: [{ type: String, trim: true }],
          end_time: [{ type: String, trim: true }],
        },
        Sunday: {
          start_time: [{ type: String, trim: true }],
          end_time: [{ type: String, trim: true }],
        },
      },
      volunteer_unavailable_dates: {
        first_date_unavailable: [{ type: Date }],
        last_date_unavailable: [{ type: Date }],
      },
      volunteer_driving_information: {
        accessible_parking_permit: {
          parking_permit: { type: Boolean },
          parking_permit_number: { type: String, trim: true },
          parking_permit_expiry_date: { type: Date },
        },
        drivers_license_number: { type: String, trim: true },
        drivers_abstract: {
          completion_date: [{ type: Date }],
          expiration_date: { type: Date },
          notes: { type: String, trim: true },
        },
        vehicle_information: {
          vehicle_make: [{ type: String, trim: true }],
          vehicle_model: [{ type: String, trim: true }],
          vehicle_year: { type: String, trim: true },
          vehicle_type: [{ type: String, enum: vehicleTypes }],
          number_of_passengers: { type: String, trim: true },
          accommodations: [{ type: String, enum: mobilityAids }],
        },
      },
      security_clearance: {
        completion_date: [{ type: Date }],
        expiration_date: { type: Date },
        notes: { type: String, trim: true },
      },
      references: [referenceSchema],
      volunteer_bookings: [bookingSchema],
      volunteer_files: fileSchema,
      volunteer_notes: [noteSchema],
    },

    // Donor Information
    donor_information: {
      current_status: [{ type: String, enum: ['Active', 'Inactive'] }],
      active_engagement: { type: Boolean },
      monthly_donor: { type: Boolean },
      monthly_amount: { type: String, trim: true },
      donations: [donationSchema],
      donor_notes: [noteSchema],
    },

    // Funder Information
    funder_information: {
      organization_name: { type: String, trim: true },
      grant_details: {
        name: { type: String, trim: true },
        application_deadline: { type: Date },
        grant_amount: { type: String, trim: true },
      },
      contact: {
        first_name: { type: String, trim: true },
        preferred_name: { type: String, trim: true },
        last_name: { type: String, trim: true },
        email: {
          type: String,
          trim: true,
          validate(value) {
            if (value && !validator.isEmail(value)) {
              throw new Error('Invalid email');
            }
          },
        },
        cell_phone: { type: String, trim: true },
        work_phone: { type: String, trim: true },
      },
      address: addressSchema,
      current_status: [{ type: String, enum: ['Active', 'Inactive'] }],
      active_engagement: { type: Boolean },
      donations: [donationSchema],
      funder_notes: [noteSchema],
    },

    // Event Attendee Information
    event_attendee_information: {
      contact_for_events: [{ type: String, enum: contactForEvents }],
      event_attendee_bookings: [bookingSchema],
      event_attendee_notes: [noteSchema],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({
    $or: [
      { email, _id: { $ne: excludeUserId } },
      { 'personal_information.email': email, _id: { $ne: excludeUserId } },
    ],
  });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
