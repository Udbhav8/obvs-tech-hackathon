import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User'; // Assuming User model path
import { Booking } from '@/models/Booking'; // Assuming Booking model path

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: 'Search query is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    const userSearchRegex = new RegExp(query, 'i'); // Case-insensitive regex

    const users = await User.find({
      $or: [
        { 'personal_information.first_name': userSearchRegex },
        { 'personal_information.last_name': userSearchRegex },
        { 'personal_information.email': userSearchRegex },
        { name: userSearchRegex }, // If you have a concatenated name field
      ],
    }).limit(10); // Limit results for performance

    const bookingSearchRegex = new RegExp(query, 'i');

    // Convert query to number for booking_id search if possible
    const queryAsNumber = parseInt(query, 10);
    const bookingIdSearch = isNaN(queryAsNumber) ? null : queryAsNumber;

    const bookingQueryConditions: any[] = [
        { notes: bookingSearchRegex },
        { 'pickup_address_description': bookingSearchRegex },
        { 'pickup_address_street': bookingSearchRegex },
        { 'pickup_address_city': bookingSearchRegex },
        { 'destination_address_description': bookingSearchRegex },
        { 'destination_address_street': bookingSearchRegex },
        { 'destination_address_city': bookingSearchRegex },
        { service_type: bookingSearchRegex }, // From ServiceProgramBooking
        { location_description: bookingSearchRegex }, // From EventBooking
        { location_street: bookingSearchRegex }, // From EventBooking
        { location_city: bookingSearchRegex }, // From EventBooking
    ];

    if (bookingIdSearch !== null) {
        bookingQueryConditions.push({ booking_id: bookingIdSearch });
    }


    const bookings = await Booking.find({
      $or: bookingQueryConditions,
    }).limit(10); // Limit results for performance

    return NextResponse.json({ users, bookings });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ message: 'Error performing search', error: (error as Error).message }, { status: 500 });
  }
} 