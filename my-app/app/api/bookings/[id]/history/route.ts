import { NextRequest, NextResponse } from "next/server";
import { JobHistory } from "@/models/Booking";
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

    // Get job history for this booking, sorted by timestamp (newest first)
    const jobHistory = await JobHistory.find({ booking_id: bookingId })
      .sort({ timestamp: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: jobHistory,
    });
  } catch (error) {
    console.error("Error fetching job history:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch job history",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
