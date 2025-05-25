import { NextRequest, NextResponse } from "next/server";
import {
  Booking,
  ServiceProgramBooking,
  EventBooking,
  BookingClientRelation,
  BookingVolunteerRelation,
  EventAttendee,
  JobHistory,
} from "@/models/Booking";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const bookingId = parseInt(params.id);
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    // Get the booking
    const booking = await Booking.findOne({ booking_id: bookingId }).lean();
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Get related data
    const clientRelations = await BookingClientRelation.find({
      booking_id: bookingId,
    }).lean();

    const volunteerRelations = await BookingVolunteerRelation.find({
      booking_id: bookingId,
    }).lean();

    let eventAttendees = null;
    if (booking.booking_type === "Event") {
      eventAttendees = await EventAttendee.find({
        event_booking_id: bookingId,
      }).lean();
    }

    const enrichedBooking = {
      ...booking,
      clients: clientRelations,
      volunteers: volunteerRelations,
      eventAttendees,
    };

    return NextResponse.json({
      success: true,
      data: enrichedBooking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch booking",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const bookingId = parseInt(params.id);
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Find existing booking
    const existingBooking = await Booking.findOne({ booking_id: bookingId });
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Update booking
    const updatedBooking = await Booking.findOneAndUpdate(
      { booking_id: bookingId },
      { $set: body },
      { new: true, runValidators: true }
    );

    // Update client relations if provided
    if (body.clients && Array.isArray(body.clients)) {
      await BookingClientRelation.deleteMany({ booking_id: bookingId });

      const clientRelations = body.clients.map(
        (client: any, index: number) => ({
          booking_id: bookingId,
          client_id: client.client_id,
          is_primary: index === 0,
        })
      );

      await BookingClientRelation.insertMany(clientRelations);
    }

    // Update volunteer relations if provided
    if (body.volunteers && Array.isArray(body.volunteers)) {
      await BookingVolunteerRelation.deleteMany({ booking_id: bookingId });

      const volunteerRelations = body.volunteers.map((volunteer: any) => ({
        booking_id: bookingId,
        volunteer_id: volunteer.volunteer_id,
        status: volunteer.status || "Assigned",
      }));

      await BookingVolunteerRelation.insertMany(volunteerRelations);
    }

    // Update event attendees if it's an event booking
    if (
      existingBooking.booking_type === "Event" &&
      body.attendees &&
      Array.isArray(body.attendees)
    ) {
      await EventAttendee.deleteMany({ event_booking_id: bookingId });

      const attendees = body.attendees.map((attendee: any) => ({
        event_booking_id: bookingId,
        user_id: attendee.user_id || null,
        external_name: attendee.external_name || null,
        user_type: attendee.user_type,
      }));

      await EventAttendee.insertMany(attendees);
    }

    // Create job history entry
    const historyEntry = new JobHistory({
      history_id: Date.now(),
      booking_id: bookingId,
      user_id: body.updated_by_user_id || 1,
      action: `Booking updated`,
      timestamp: new Date(),
    });

    await historyEntry.save();

    return NextResponse.json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const bookingId = parseInt(params.id);
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await Booking.findOne({ booking_id: bookingId });
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Instead of hard delete, update status to "Deleted"
    const updatedBooking = await Booking.findOneAndUpdate(
      { booking_id: bookingId },
      { $set: { status: "Deleted" } },
      { new: true }
    );

    // Create job history entry
    const historyEntry = new JobHistory({
      history_id: Date.now(),
      booking_id: bookingId,
      user_id: 1, // Should come from auth
      action: `Booking deleted`,
      timestamp: new Date(),
    });

    await historyEntry.save();

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete booking",
      },
      { status: 500 }
    );
  }
}
