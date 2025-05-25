import { NextRequest, NextResponse } from "next/server";
import { Booking, JobHistory } from "@/models/Booking";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(
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
    const { reason, notes } = body;

    if (!reason) {
      return NextResponse.json(
        { success: false, error: "Cancellation reason is required" },
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

    // Update booking with cancellation details
    const updatedBooking = await Booking.findOneAndUpdate(
      { booking_id: bookingId },
      {
        $set: {
          status: "Cancelled",
          cancellation_reason: reason,
          cancellation_notes: notes || null,
        },
      },
      { new: true, runValidators: true }
    );

    // Create job history entry
    const historyEntry = new JobHistory({
      history_id: Date.now(),
      booking_id: bookingId,
      user_id: body.cancelled_by_user_id || 1, // Should come from auth
      action: `Booking cancelled: ${reason}${notes ? ` - ${notes}` : ""}`,
      timestamp: new Date(),
    });

    await historyEntry.save();

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to cancel booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
