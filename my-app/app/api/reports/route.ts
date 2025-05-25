import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import UserModel from "../../../models/User"; // Your user Mongoose model
import { fetchUserEnumsFromDatabase } from "../../../enums/enum-utils"; // Update with actual path

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    switch (type) {
      case "new":
        return await handleNewVolunteers(searchParams);
      case "birthdays":
        return await handleVolunteerBirthdays(searchParams);
      case "enum":
        return await handleEnumFetch(); 
      case "active_services":
        return await handleActiveServices(searchParams);
      default:
        return NextResponse.json(
          { message: "Invalid volunteer report type requested." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Volunteer API error:", error);
    return NextResponse.json(
      { message: "Unable to return volunteer data." },
      { status: 400 }
    );
  }
}

// === NEW: Handler for User Enums ===

async function handleEnumFetch() {
  try {
    const enums = await fetchUserEnumsFromDatabase();
    //console.log("Fetched enums:", enums);
    return NextResponse.json({ enums }, { status: 200 });
  } catch (error) {
    console.error("Error fetching enums:", error);
    return NextResponse.json(
      { message: "Failed to fetch enums." },
      { status: 500 }
    );
  }
}

// === Existing handlers (unchanged) ===

async function handleNewVolunteers(searchParams: URLSearchParams) {
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  if (!month || !year) {
    return NextResponse.json(
      { message: "Month and year are required." },
      { status: 400 }
    );
  }

  try {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 1);

    const newVolunteers = await UserModel.find({
      "general_information.roles": "Volunteer",
      "volunteer_information.volunteer_start_date": {
        $gte: startDate,
        $lt: endDate,
      },
    });

    return NextResponse.json({ message: newVolunteers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching new volunteers:", error);
    return NextResponse.json(
      { message: "Unable to fetch new volunteers." },
      { status: 400 }
    );
  }
}

async function handleVolunteerBirthdays(searchParams: URLSearchParams) {
  const month = searchParams.get("month");

  if (!month) {
    return NextResponse.json(
      { message: "Month is required." },
      { status: 400 }
    );
  }

  try {
    const volunteers = await UserModel.find({
      "general_information.roles": "Volunteer",
      "personal_information.date_of_birth": { $exists: true },
    });

    const targetMonth = parseInt(month) - 1;

    const birthdayVolunteers = volunteers.filter((user: any) => {
      const dob = new Date(user.personal_information.date_of_birth);
      return dob.getMonth() === targetMonth;
    });

    const result = birthdayVolunteers.map((user: any) => ({
      name: `${user.personal_information.first_name} ${user.personal_information.last_name}`,
      birthday: user.personal_information.date_of_birth,
    }));

    return NextResponse.json({ message: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching birthdays:", error);
    return NextResponse.json(
      { message: "Unable to fetch volunteer birthdays." },
      { status: 400 }
    );
  }
}

async function handleActiveServices(searchParams: URLSearchParams) {
    const service = searchParams.get("service");
  
    if (!service) {
      return NextResponse.json(
        { message: "Service is required." },
        { status: 400 }
      );
    }
  
    try {
        console.log("Active service :", service);
      const activeServices = await UserModel.find({
        "general_information.roles": "Volunteer",
        "volunteer_information.volunteer_services": {
          $elemMatch: {
            service_type: service,
            is_active: true,
          },
        },
      });

      //console.log("Active service volunteers:", activeServices[0]["volunteer_information"].volunteer_services);
  
      return NextResponse.json({ message: activeServices }, { status: 200 });
    } catch (error) {
      console.error("Error fetching active services:", error);
      return NextResponse.json(
        { message: "Unable to fetch active services." },
        { status: 400 }
      );
    }
  }
  