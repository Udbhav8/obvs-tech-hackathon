import { NextRequest, NextResponse } from "next/server";
import { fetchBookingEnumsFromDatabase } from "@/enums/enum-utils";

export async function GET(request: NextRequest) {
  try {
    const enums = await fetchBookingEnumsFromDatabase();

    return NextResponse.json({
      success: true,
      data: enums,
    });
  } catch (error) {
    console.error("Error fetching booking enums:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch booking enums",
      },
      { status: 500 }
    );
  }
}
