// models/Donation.ts
// This file defines the Mongoose schemas and models for Donations, Donor Profiles, and Receipts.
// It is adapted from your provided Donations.ts to be used directly by the Next.js backend.

import mongoose, { Document, Schema, Model } from 'mongoose';

// ------------------------------------------------------------------------------------------------
// INTERFACES
// ------------------------------------------------------------------------------------------------

// Interface for Donation
export interface IDonation extends Document {
  donation_id?: number; // Optional as Mongoose will handle _id, and we might generate this if needed
  donation_type: string;
  donor_id: mongoose.Types.ObjectId; // Foreign key reference to User/DonorProfile
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
  created_by?: mongoose.Types.ObjectId; // Foreign key reference to User
  updated_by?: mongoose.Types.ObjectId; // Foreign key reference to User
}

// Interface for Donor Profile (as described in schema, linked to User)
export interface IDonorProfile extends Document {
  donor_id?: number; // Optional as Mongoose will handle _id
  first_name?: string | null;
  last_name?: string | null;
  organization_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address_street?: string | null;
  address_city?: string | null;
  address_province?: string | null;
  address_postal_code?: string | null;
  tax_receipt_address: boolean;
  is_anonymous: boolean;
  donor_type: string; // Added as it was in your original interface but missing from schema properties
  // donation_history_summary will be a virtual field or populated on retrieval
  created_at: Date;
  updated_at: Date;
}

// Interface for Receipt
export interface IReceipt extends Document {
  receipt_id?: number; // Optional as Mongoose will handle _id
  donation_id: mongoose.Types.ObjectId; // Foreign key reference to Donation
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
  // donation_id is typically handled by Mongoose's default _id, but if a specific numeric ID is required,
  // it would need a custom pre-save hook or a separate sequence collection.
  // For now, we'll rely on Mongoose's _id for unique identification.
  donation_type: { type: String, required: true },
  donor_id: { type: Schema.Types.ObjectId, required: true, ref: 'DonorProfile' }, // Reference to DonorProfile model
  donation_amount: { type: Number, required: true },
  eligible_amount: {
    type: Number,
    required: true,
    // Auto-populate eligible_amount with donation_amount if not provided
    default: function(this: IDonation) { return this.donation_amount; }
  },
  value_advantage: {
    type: Number,
    required: true,
    default: 0.00 // Auto-populate to 0.00
  },
  payment_type: { type: String, required: true },
  receipt_type: { type: String, required: true },
  receipt_sent_date: { type: Date, default: null }, // Nullable
  received_date: { type: Date, required: true, default: Date.now }, // Auto-populate to today's date
  processed_date: { type: Date, required: true, default: Date.now }, // Auto-populate to today's date
  deposit_date: { type: Date, required: true, default: Date.now }, // Auto-populate to today's date
  notes: { type: String, default: null }, // Optional
  created_by: { type: Schema.Types.ObjectId, ref: 'User' }, // User ID who created (assuming a User model exists)
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' }, // User ID who last updated
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }); // Use mongoose timestamps for these fields

// Donor Profile Schema
const DonorProfileSchema = new Schema<IDonorProfile>({
  // We'll use Mongoose's default _id for donor identification.
  // The original `donor_id` field is removed as `_id` serves this purpose.
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  organization_name: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  address_street: { type: String, default: null },
  address_city: { type: String, default: null },
  address_province: { type: String, default: null },
  address_postal_code: { type: String, default: null },
  tax_receipt_address: { type: Boolean, required: true, default: false },
  is_anonymous: { type: Boolean, required: true, default: false },
  donor_type: { type: String, required: true }, // Added as per interface
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


// Receipt Schema
const ReceiptSchema = new Schema<IReceipt>({
  // receipt_id handled by Mongoose's _id
  donation_id: { type: Schema.Types.ObjectId, required: true, ref: 'Donation' }, // Reference to Donation model
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

// Check if models already exist to prevent Mongoose OverwriteModelError in development
export const Donation: Model<IDonation> = mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema);
export const DonorProfile: Model<IDonorProfile> = mongoose.models.DonorProfile || mongoose.model<IDonorProfile>('DonorProfile', DonorProfileSchema);
export const Receipt: Model<IReceipt> = mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', ReceiptSchema);
