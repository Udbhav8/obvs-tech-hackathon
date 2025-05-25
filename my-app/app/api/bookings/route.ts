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

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const bookingType = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Build query filter
    const filter: any = {};
    if (status) filter.status = status;
    if (bookingType) filter.booking_type = bookingType;

    // Get bookings with pagination
    const bookings = await Booking.find(filter)
      .sort({ date: -1, start_time: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Booking.countDocuments(filter);

    // Get related data for each booking
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        // Get client relations
        const clientRelations = await BookingClientRelation.find({
          booking_id: booking.booking_id,
        }).lean();

        // Get volunteer relations
        const volunteerRelations = await BookingVolunteerRelation.find({
          booking_id: booking.booking_id,
        }).lean();

        // Get event attendees if it's an event booking
        let eventAttendees = null;
        if (booking.booking_type === "Event") {
          eventAttendees = await EventAttendee.find({
            event_booking_id: booking.booking_id,
          }).lean();
        }

        return {
          ...booking,
          clients: clientRelations,
          volunteers: volunteerRelations,
          eventAttendees,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedBookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Generate booking ID (you might want to implement a more robust ID generation)
    const lastBooking = await Booking.findOne(
      {},
      {},
      { sort: { booking_id: -1 } }
    );
    const bookingId = lastBooking ? lastBooking.booking_id + 1 : 1000;

    // Prepare booking data
    const bookingData = {
      ...body,
      booking_id: bookingId,
      client_confirmation: body.client_confirmation || false,
      is_parent_booking: body.is_parent_booking || false,
      num_volunteers_needed: body.num_volunteers_needed || 1,
      status: body.status || "Not Assigned",
    };

    let newBooking;

    // Create appropriate booking type
    if (body.booking_type === "Event") {
      newBooking = new EventBooking(bookingData);
    } else {
      newBooking = new ServiceProgramBooking(bookingData);
    }

    await newBooking.save();

    // Create client relations
    if (body.clients && Array.isArray(body.clients)) {
      const clientRelations = body.clients.map(
        (client: any, index: number) => ({
          booking_id: bookingId,
          client_id: client.client_id,
          is_primary: index === 0, // First client is primary
        })
      );

      await BookingClientRelation.insertMany(clientRelations);
    }

    // Create volunteer relations if volunteers are assigned
    if (body.volunteers && Array.isArray(body.volunteers)) {
      const volunteerRelations = body.volunteers.map((volunteer: any) => ({
        booking_id: bookingId,
        volunteer_id: volunteer.volunteer_id,
        status: volunteer.status || "Assigned",
      }));

      await BookingVolunteerRelation.insertMany(volunteerRelations);
    }

    // Create event attendees if it's an event booking
    if (
      body.booking_type === "Event" &&
      body.attendees &&
      Array.isArray(body.attendees)
    ) {
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
      history_id: Date.now(), // Simple ID generation
      booking_id: bookingId,
      user_id: body.created_by_user_id || 1, // Default user, should come from auth
      action: `Booking created: ${body.booking_type} - ${body.service_type || "Event"}`,
      timestamp: new Date(),
    });

    await historyEntry.save();

    // Handle recurring bookings
    if (
      body.frequency_type !== "One-Time" &&
      body.end_date &&
      body.recurrence_frequency
    ) {
      await createRecurringBookings(newBooking, body);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          booking_id: bookingId,
          message: "Booking created successfully",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper function to create recurring bookings
async function createRecurringBookings(parentBooking: any, originalData: any) {
  try {
    const startDate = new Date(parentBooking.date);
    const endDate = new Date(originalData.end_date);
    const recurrenceFreq = originalData.recurrence_frequency;
    const recurrenceDays = originalData.recurrence_days || [];

    const recurringBookings = [];
    let currentDate = new Date(startDate);

    // Move to next occurrence
    switch (recurrenceFreq) {
      case "Daily":
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case "Weekly":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "Bi-weekly":
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case "Monthly":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "Annually":
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }

    while (currentDate <= endDate) {
      // Check if this day should be included (if recurrence_days specified)
      if (
        recurrenceDays.length === 0 ||
        recurrenceDays.includes(currentDate.getDay())
      ) {
        const lastBooking = await Booking.findOne(
          {},
          {},
          { sort: { booking_id: -1 } }
        );
        const newBookingId = lastBooking.booking_id + 1;

        const recurringBookingData = {
          ...parentBooking.toObject(),
          _id: undefined,
          booking_id: newBookingId,
          date: new Date(currentDate),
          is_parent_booking: false,
          parent_booking_id: parentBooking.booking_id,
          status: "Not Assigned", // Reset status for new bookings
        };

        let newRecurringBooking;
        if (originalData.booking_type === "Event") {
          newRecurringBooking = new EventBooking(recurringBookingData);
        } else {
          newRecurringBooking = new ServiceProgramBooking(recurringBookingData);
        }

        await newRecurringBooking.save();
        recurringBookings.push(newRecurringBooking);
      }

      // Move to next occurrence
      switch (recurrenceFreq) {
        case "Daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "Weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "Bi-weekly":
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case "Monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "Annually":
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }

    return recurringBookings;
  } catch (error) {
    console.error("Error creating recurring bookings:", error);
    throw error;
  }
}
