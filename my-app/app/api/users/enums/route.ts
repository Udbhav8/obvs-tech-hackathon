import { NextResponse } from "next/server";
import { fetchUserEnumsFromDatabase } from "@/enums/enum-utils";

/**
 * Handles GET requests to /api/donations/enums.
 * Fetches all donations-related enums from the database with fallback to local definitions.
 * @returns {NextResponse} The response containing the donations enums or an error.
 */
export async function GET() {
    try {
        const donationsEnums = await fetchUserEnumsFromDatabase();
        return NextResponse.json(donationsEnums, { status: 200 });
    } catch (error) {
        console.error("Error fetching donations enums:", error);
        return NextResponse.json(
            {
                message: "Failed to fetch donations enums",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
