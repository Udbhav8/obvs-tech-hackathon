import { NextRequest, NextResponse } from "next/server";
import {
  Booking,
  ServiceProgramBooking,
  EventBooking,
  BookingClientRelation,
  JobHistory,
  IBooking,
  IBookingClientRelation,
} from "@/models/Booking";
import { connectToDatabase } from "@/lib/mongodb";

interface ReplicateRequestData {
  frequency: string;
  date?: string;
  time?: string;
  end_date?: string;
  recurrence_frequency?: string;
  recurrence_days?: number[];
  created_by_user_id?: number;
  originalBooking?: Record<string, any>; // Generic object for booking data
  clientRelations?: IBookingClientRelation[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const originalBookingId = parseInt(params.id);
    if (isNaN(originalBookingId)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      frequency,
      date,
      time,
      end_date,
      recurrence_frequency,
      recurrence_days,
    } = body;

    // Find the original booking
    const originalBooking = await Booking.findOne({
      booking_id: originalBookingId,
    });
    if (!originalBooking) {
      return NextResponse.json(
        { success: false, error: "Original booking not found" },
        { status: 404 }
      );
    }

    // Get client relations from original booking
    const originalClientRelations = await BookingClientRelation.find({
      booking_id: originalBookingId,
    });

    // Generate new booking ID
    const lastBooking = await Booking.findOne(
      {},
      {},
      { sort: { booking_id: -1 } }
    );
    const newBookingId = lastBooking ? lastBooking.booking_id + 1 : 1000;

    // Prepare new booking data (copy from original but reset certain fields)
    const newBookingData = {
      ...originalBooking.toObject(),
      booking_id: newBookingId,
      date: date || originalBooking.date,
      start_time: time || originalBooking.start_time,
      appointment_time: time || originalBooking.appointment_time,
      status: "Not Assigned", // Reset status
      client_confirmation: false, // Reset confirmation
      cancellation_reason: null,
      cancellation_notes: null,
      frequency_type: frequency || "One-Time",
      end_date: frequency !== "One-Time" ? end_date || null : null,
      recurrence_frequency:
        frequency !== "One-Time" ? recurrence_frequency || null : null,
      recurrence_days:
        frequency !== "One-Time" ? recurrence_days || null : null,
      is_parent_booking: frequency !== "One-Time",
      parent_booking_id: null,
      _id: undefined, // Remove the original _id
      createdAt: undefined,
      updatedAt: undefined,
    };

    let newBooking;

    // Create appropriate booking type
    if (originalBooking.booking_type === "Event") {
      newBooking = new EventBooking(newBookingData);
    } else {
      newBooking = new ServiceProgramBooking(newBookingData);
    }

    await newBooking.save();

    // Replicate client relations
    if (originalClientRelations.length > 0) {
      const newClientRelations = originalClientRelations.map((relation) => ({
        booking_id: newBookingId,
        client_id: relation.client_id,
        is_primary: relation.is_primary,
      }));

      await BookingClientRelation.insertMany(newClientRelations);
    }

    // Create job history entry for the new booking
    const historyEntry = new JobHistory({
      history_id: Date.now(),
      booking_id: newBookingId,
      user_id: body.created_by_user_id || 1, // Should come from auth
      action: `Booking replicated from #${originalBookingId}`,
      timestamp: new Date(),
    });

    await historyEntry.save();

    // Handle recurring bookings if frequency is not one-time
    if (frequency !== "One-Time" && end_date && recurrence_frequency) {
      await createRecurringBookingsFromReplicate(newBooking, {
        ...body,
        originalBooking: originalBooking.toObject(),
        clientRelations: originalClientRelations,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        booking_id: newBookingId,
        message: "Booking replicated successfully",
      },
    });
  } catch (error) {
    console.error("Error replicating booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to replicate booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function createRecurringBookingsFromReplicate(
  parentBooking: IBooking,
  data: ReplicateRequestData
) {
  const {
    end_date,
    recurrence_frequency,
    recurrence_days,
    originalBooking,
    clientRelations,
  } = data;

  const startDate = new Date(parentBooking.date);
  const endDate = new Date(end_date!);
  const bookings = [];

  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1); // Start from next occurrence

  while (currentDate <= endDate) {
    let shouldCreateBooking = false;

    switch (recurrence_frequency) {
      case "Daily":
        shouldCreateBooking = true;
        break;
      case "Weekly":
        if (!recurrence_days || recurrence_days.length === 0) {
          shouldCreateBooking = currentDate.getDay() === startDate.getDay();
        } else {
          shouldCreateBooking = recurrence_days.includes(currentDate.getDay());
        }
        break;
      case "Bi-weekly":
        const weeksDiff = Math.floor(
          (currentDate.getTime() - startDate.getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        );
        if (!recurrence_days || recurrence_days.length === 0) {
          shouldCreateBooking =
            weeksDiff % 2 === 0 && currentDate.getDay() === startDate.getDay();
        } else {
          shouldCreateBooking =
            weeksDiff % 2 === 0 &&
            recurrence_days.includes(currentDate.getDay());
        }
        break;
      case "Monthly":
        shouldCreateBooking = currentDate.getDate() === startDate.getDate();
        break;
      case "Annually":
        shouldCreateBooking =
          currentDate.getDate() === startDate.getDate() &&
          currentDate.getMonth() === startDate.getMonth();
        break;
    }

    if (shouldCreateBooking) {
      // Generate new booking ID for recurring booking
      const lastBooking = await Booking.findOne(
        {},
        {},
        { sort: { booking_id: -1 } }
      );
      const recurringBookingId = lastBooking
        ? lastBooking.booking_id + 1
        : 1000;

      const recurringBookingData = {
        ...originalBooking,
        booking_id: recurringBookingId,
        date: new Date(currentDate),
        status: "Not Assigned",
        client_confirmation: false,
        cancellation_reason: null,
        cancellation_notes: null,
        is_parent_booking: false,
        parent_booking_id: parentBooking.booking_id,
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      let newRecurringBooking;
      if (originalBooking?.booking_type === "Event") {
        newRecurringBooking = new EventBooking(recurringBookingData);
      } else {
        newRecurringBooking = new ServiceProgramBooking(recurringBookingData);
      }

      await newRecurringBooking.save();

      // Create client relations for recurring booking
      if (clientRelations && clientRelations.length > 0) {
        const newClientRelations = clientRelations.map(
          (relation: IBookingClientRelation) => ({
            booking_id: recurringBookingId,
            client_id: relation.client_id,
            is_primary: relation.is_primary,
          })
        );

        await BookingClientRelation.insertMany(newClientRelations);
      }

      bookings.push(newRecurringBooking);
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return bookings;
}
