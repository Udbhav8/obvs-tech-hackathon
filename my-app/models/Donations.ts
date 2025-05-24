import mongoose, { Document, Schema } from 'mongoose';


// ------------------------------------------------------------------------------------------------
// INTERFACES
// ------------------------------------------------------------------------------------------------

// Interface for Donation
export interface IDonation extends Document {
  donation_id: number;
  donation_type: string;
  donor_id: number; // Foreign key reference to User (donor role)
  donation_amount: number;
  eligible_amount: number;
  value_advantage: number;
  payment_type: string;
  receipt_type: string;
  receipt_sent_date?: Date | null;
  received_date: Date;
  processed_date: Date;
  deposit_date: Date;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
  created_by: number; // Foreign key reference to User
  updated_by: number; // Foreign key reference to User
}

// Interface for Donor Profile (as described in schema, linked to User)
export interface IDonorProfile extends Document {
  donor_id: number; // Primary key identifier for the donor
  donor_type: string; // Type of donor
  first_name?: string | null; // First name of the donor, for individuals
  last_name?: string | null; // Last name of the donor, for individuals
  organization_name?: string | null; // Name of the organization, for organizations
  email?: string | null; // Email address of the donor
  phone?: string | null; // Phone number of the donor
  address_street?: string | null; // Street address of the donor
  address_city?: string | null; // City of the donor's address
  address_province?: string | null; // Province/state of the donor's address
  address_postal_code?: string | null; // Postal/zip code of the donor's address
  tax_receipt_address: boolean; // Indicates if address can be used for tax receipts
  is_anonymous: boolean; // Indicates if the donor wishes to remain anonymous
  donation_history_summary?: { // Virtual field - calculated summary of donation history
    total_donations: number;
    donation_count: number;
    first_donation_date?: Date | null;
    last_donation_date?: Date | null;
    average_donation: number;
  };
  created_at: Date; // Timestamp when the donor record was created
  updated_at: Date; // Timestamp when the donor record was last updated
}

// Interface for Receipt
export interface IReceipt extends Document {
  receipt_id: number;
  donation_id: number; // Foreign key reference to Donation
  receipt_number: string;
  issue_date: Date;
  sent_date?: Date | null;
  sent_method: string;
  status: string;
  pdf_file_path: string;
}


// ------------------------------------------------------------------------------------------------
// SCHEMAS
// ------------------------------------------------------------------------------------------------

// Donation Schema
const DonationSchema = new Schema<IDonation>({
  donation_id: { type: Number, required: true, unique: true },
  donation_type: { type: String, required: true },
  donor_id: { type: Number, required: true, ref: 'User' }, // Reference to User model (UserRole.DONOR)
  donation_amount: { type: Number, required: true },
  eligible_amount: { type: Number, required: true, default: function(this: IDonation) { return this.donation_amount; } }, // Auto-populate
  value_advantage: { type: Number, required: true, default: 0.00 }, // Auto-populate
  payment_type: { type: String, required: true },
  receipt_type: { type: String, required: true },
  receipt_sent_date: { type: Date, default: null }, // Nullable
  received_date: { type: Date, required: true, default: Date.now }, // Auto-populate to today's date
  processed_date: { type: Date, required: true, default: Date.now }, // Auto-populate to today's date
  deposit_date: { type: Date, required: true, default: Date.now }, // Auto-populate to today's date
  notes: { type: String, default: null }, // Optional
  created_by: { type: Number, required: true, ref: 'User' }, // User ID who created
  updated_by: { type: Number, required: true, ref: 'User' }, // User ID who last updated
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }); // Use mongoose timestamps for these fields

// Donor Profile Schema (for linking to User if separate collection is desired, otherwise integrate into User.ts)
const DonorProfileSchema = new Schema<IDonorProfile>({
  donor_id: { type: Number, required: true, unique: true, ref: 'User' }, // Links to user_id in User.ts
  donor_type: { type: String, required: true },
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  organization_name: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  address_street: { type: String, default: null },
  address_city: { type: String, default: null },
  address_province: { type: String, default: null },
  address_postal_code: { type: String, default: null },
  tax_receipt_address: { type: Boolean, required: true },
  is_anonymous: { type: Boolean, required: true },
  // donation_history_summary will be a virtual field or populated on retrieval
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
}, { _id: false, timestamps: false }); // _id: false as donor_id is the primary key, handle timestamps manually if User.ts doesn't.
// Note: In a real application, Donor profile might be part of the User model itself or a separate collection with strong linking.
// Given User.ts already has a donor_information field, integrating this IDonorProfile logic there would be more consistent.
// For now, it's defined as per the separate "Donor" definition in the schema, but consider unifying.

// Receipt Schema
const ReceiptSchema = new Schema<IReceipt>({
  receipt_id: { type: Number, required: true, unique: true },
  donation_id: { type: Number, required: true, ref: 'Donation' }, // Reference to Donation model
  receipt_number: { type: String, required: true, unique: true },
  issue_date: { type: Date, required: true, default: Date.now },
  sent_date: { type: Date, default: null },
  sent_method: { type: String, required: true },
  status: { type: String, required: true },
  pdf_file_path: { type: String, required: true },
}, { timestamps: true });


// ------------------------------------------------------------------------------------------------
// MODELS
// ------------------------------------------------------------------------------------------------

export const Donation = mongoose.model<IDonation>('Donation', DonationSchema);
export const DonorProfile = mongoose.model<IDonorProfile>('DonorProfile', DonorProfileSchema); // Exported for completeness, consider integrating into User model
export const Receipt = mongoose.model<IReceipt>('Receipt', ReceiptSchema);
