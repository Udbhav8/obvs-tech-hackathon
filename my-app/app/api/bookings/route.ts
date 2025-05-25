import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb"; // Assuming this path is correct from the new route location
import { Booking } from "../../../models/Booking"; // Corrected import

// Define a more specific type for the booking query if needed
interface BookingQuery {
  $or?: Array<Record<string, unknown>>;
  booking_id?: number;
  $text?: { $search: string }; // For text search operator
  // Add other specific query fields if necessary
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");
    console.log("[Booking API] Received searchTerm for regex search:", searchTerm);

    let query: BookingQuery = {};

    if (searchTerm && searchTerm.trim() !== "") {
      const trimmedSearchTerm = searchTerm.trim();
      const regex = { $regex: trimmedSearchTerm, $options: "i" }; // Case-insensitive regex

      query.$or = [
        { notes: regex },
        { service_type: regex },
        { status: regex },
        { cancellation_reason: regex },
        { cancellation_notes: regex },
        { pickup_address_description: regex },
        { pickup_address_street: regex },
        { pickup_address_city: regex },
        { destination_address_description: regex },
        { destination_address_street: regex },
        { destination_address_city: regex },
      ];

      const searchNumber = parseInt(trimmedSearchTerm, 10);
      if (!isNaN(searchNumber)) {
        // If searchTerm is a number, add booking_id check to the $or array
        // or handle it as a primary condition if you prefer booking_id to be an exact match search
        query.$or.push({ booking_id: searchNumber });
      }
    }

    // console.log("[Booking API] Query:", JSON.stringify(query, null, 2));

    const bookings = await Booking.find(query)
      .sort({ date: -1, start_time: -1 })
      .limit(50);

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[Booking API] GET bookings error (regex search):", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred while searching bookings" },
      { status: 500 }
    );
  }
}

// Placeholder for POST, PUT, DELETE handlers if needed in this route later
// For example, to create a new booking:
// export async function POST(request: NextRequest) { ... } 