// app/api/donations/route.ts
// This file defines the API routes for handling donation-related requests.

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // Updated import path to your new connection utility
import { Donation, DonorProfile, IDonation, IDonorProfile } from '../../../models/Donations'; // Import models and interfaces
import mongoose from 'mongoose'; // Still needed for mongoose.Types.ObjectId

/**
 * Handles GET requests to /api/donations.
 * Fetches all donations from the database, optionally filtered by donor name.
 * @param {Request} request The incoming request object.
 * @returns {NextResponse} The response containing the list of donations or an error.
 */
export async function GET(request: Request) {
  const db = await connectDB(); // Establish database connection using your new connectDB
  if (!db) {
    return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const donorName = searchParams.get('donorName'); // Get donorName from query parameters

    let donations: IDonation[] = [];

    if (donorName) {
      // If donorName is provided, find matching donor profiles first
      const donors = await DonorProfile.find({
        $or: [
          { first_name: { $regex: donorName, $options: 'i' } }, // Case-insensitive search
          { last_name: { $regex: donorName, $options: 'i' } },
          { organization_name: { $regex: donorName, $options: 'i' } },
        ],
      });

      const donorIds = donors.map(donor => donor._id);

      // Find donations associated with these donor IDs
      donations = await Donation.find({ donor_id: { $in: donorIds } }).populate('donor_id').sort({ received_date: -1 });
    } else {
      // If no donorName, fetch all donations
      donations = await Donation.find({}).populate('donor_id').sort({ received_date: -1 });
    }

    return NextResponse.json(donations, { status: 200 });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json({ message: 'Failed to fetch donations', error: (error as Error).message }, { status: 500 });
  }
}

/**
 * Handles POST requests to /api/donations.
 * Creates a new donation record and, if necessary, a new donor profile.
 * @param {Request} request The incoming request object.
 * @returns {NextResponse} The response containing the created donation or an error.
 */
export async function POST(request: Request) {
  const db = await connectDB(); // Establish database connection using your new connectDB
  if (!db) {
    return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      donation_type,
      donor_name, // This will be used to find/create donor
      donation_amount,
      payment_type,
      receipt_type,
      received_date,
      processed_date,
      deposit_date,
      notes,
      eligible_amount, // These might be auto-populated by schema defaults
      value_advantage, // These might be auto-populated by schema defaults
      // created_by, updated_by are placeholders for now
    } = body;

    // 1. Find or Create Donor Profile
    let donorProfile: IDonorProfile | null = null;

    // Attempt to find donor by name (case-insensitive)
    // This is a simplified lookup. In a real app, you might use email or a unique ID.
    donorProfile = await DonorProfile.findOne({
      $or: [
        { first_name: { $regex: `^${donor_name}$`, $options: 'i' } },
        { last_name: { $regex: `^${donor_name}$`, $options: 'i' } },
        { organization_name: { $regex: `^${donor_name}$`, $options: 'i' } },
      ],
    });

    if (!donorProfile) {
      // If donor not found, create a new DonorProfile
      // For simplicity, we'll assume donor_name is the first name for individuals
      // and default other fields. In a real app, you'd need more robust donor creation.
      donorProfile = await DonorProfile.create({
        first_name: donor_name, // Assuming donor_name is the first name for simplicity
        donor_type: 'Personal', // Default type, could be passed from frontend
        tax_receipt_address: false, // Default
        is_anonymous: false, // Default
      });
      console.log('New donor profile created:', donorProfile);
    }

    // 2. Create Donation Record
    const newDonation = await Donation.create({
      donation_type,
      donor_id: donorProfile._id, // Link to the found or created donor
      donation_amount: parseFloat(donation_amount),
      eligible_amount: eligible_amount ? parseFloat(eligible_amount) : parseFloat(donation_amount), // Use provided or auto-populate
      value_advantage: value_advantage ? parseFloat(value_advantage) : 0.00, // Use provided or auto-populate
      payment_type,
      receipt_type,
      received_date: new Date(received_date),
      processed_date: new Date(processed_date),
      deposit_date: new Date(deposit_date),
      notes,
      created_by: new mongoose.Types.ObjectId(), // Placeholder
      updated_by: new mongoose.Types.ObjectId(), // Placeholder
    });

    // Populate the donor_id field to return full donor details with the donation
    await newDonation.populate('donor_id');

    return NextResponse.json(newDonation, { status: 201 });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json({ message: 'Failed to create donation', error: (error as Error).message }, { status: 500 });
  }
}
