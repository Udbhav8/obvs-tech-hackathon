import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { Booking } from '@/models/Booking';

interface BookingDocument extends Document {
  _id: string;
  booking_id: number;
  service_type?: string;
  date: Date;
  status: string;
  // Add other fields that are selected and used
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.trim() === '') {
      return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
    }

    const searchRegex = new RegExp(query, 'i'); // Case-insensitive search

    // Search Users
    const users = await User.find({
      $or: [
        { 'personal_information.first_name': searchRegex },
        { 'personal_information.last_name': searchRegex },
        { 'personal_information.email': searchRegex },
        { name: searchRegex },
      ],
    }).select('name personal_information.email _id').limit(10).lean();

    // Search Bookings
    const bookingQueryConditions: any[] = [
      { service_type: searchRegex },
      { status: searchRegex },
      { pickup_address_street: searchRegex },
      { pickup_address_city: searchRegex },
      { destination_address_street: searchRegex },
      { destination_address_city: searchRegex },
    ];

    // Check if query is a number for booking_id search
    const queryAsNumber = parseInt(query, 10);
    if (!isNaN(queryAsNumber)) {
      bookingQueryConditions.push({ booking_id: queryAsNumber });
    }

    const bookings = await Booking.find({
      $or: bookingQueryConditions,
    }).select('booking_id service_type date status _id').limit(10).lean<BookingDocument[]>();

    const results = [
      ...users.map(user => ({ ...user, type: 'user', display_name: user.name, sub_text: user.personal_information?.email })),
      ...bookings.map((booking: BookingDocument) => ({ ...booking, type: 'booking', display_name: `Booking #${booking.booking_id} - ${booking.service_type || 'N/A'}`, sub_text: `Status: ${booking.status}, Date: ${new Date(booking.date).toLocaleDateString()}` })),
    ];

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    // Check if error is an instance of Error to safely access message property
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
} 