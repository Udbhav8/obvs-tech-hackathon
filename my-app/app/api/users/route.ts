import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import User, { UserRole } from "../../../models/User";
import bcrypt from "bcryptjs";
import { Status } from "@/enums/user-enums";

interface UserQuery {
  $or?: Array<Record<string, unknown>>;
  "general_information.roles"?: { $in: string[] } | string;
  "client_information.current_status"?: string;
  "volunteer_information.current_status"?: string;
}

interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  category?: string;
  position?: string;
  dateJoined?: Date;
  role?: string;
  roles?: string[];
  firstName?: string;
  lastName?: string;
  status?: string;
}

interface MongoError extends Error {
  code?: number;
}

// GET all users or a single user by ID
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const category = searchParams.get("category");

    if (id) {
      const user = await User.findById(id).select("-password");
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    const query: UserQuery = {};

    // Handle category filtering based on roles
    if (category) {
      const roleMap: Record<string, string[]> = {
        clients: [UserRole.CLIENT, UserRole.BAH],
        volunteers: [UserRole.VOLUNTEER],
        donors: [UserRole.DONOR],
        staff: [UserRole.STAFF],
        board: [UserRole.BOARD],
        "helping-hearts": [UserRole.BAH],
        "event-attendees": [UserRole.EVENT_ATTENDEE],
      };

      if (roleMap[category]) {
        query["general_information.roles"] = { $in: roleMap[category] };
      }
    }

    const users = await User.find(query).select("-password").sort({
      "personal_information.first_name": 1,
      "personal_information.last_name": 1,
      name: 1,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

// POST a new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body: UserUpdateData = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { "personal_information.email": body.email },
        { email: body.email },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Parse name
    const firstName =
      body.firstName || (body.name ? body.name.split(" ")[0] : "");
    const lastName =
      body.lastName ||
      (body.name ? body.name.split(" ").slice(1).join(" ") : "");

    // Set roles based on category or provided roles
    let userRoles = body.roles || [UserRole.USER];
    if (body.category) {
      const categoryRoleMap: Record<string, string> = {
        clients: UserRole.CLIENT,
        volunteers: UserRole.VOLUNTEER,
        donors: UserRole.DONOR,
        staff: UserRole.STAFF,
        board: UserRole.BOARD,
        "helping-hearts": UserRole.BAH,
        "event-attendees": UserRole.EVENT_ATTENDEE,
      };

      if (categoryRoleMap[body.category]) {
        userRoles = [categoryRoleMap[body.category]];
      }
    }

    // Create user with comprehensive schema
    const userData = {
      // Legacy fields for backward compatibility
      name: body.name || `${firstName} ${lastName}`.trim(),
      email: body.email || "",
      password: body.password || "",
      role: body.role || "user",

      // New schema structure
      general_information: {
        roles: userRoles,
        enews_subscription: false,
        letter_mail_subscription: false,
      },

      personal_information: {
        first_name: firstName,
        last_name: lastName,
        email: body.email || "",
        cell_phone: body.phone || "",
      },

      // Set initial status based on role
      ...(userRoles.includes(UserRole.CLIENT) && {
        client_information: {
          current_status: body.status || Status.NEW,
          client_start_date: body.dateJoined || new Date(),
        },
      }),

      ...(userRoles.includes(UserRole.VOLUNTEER) && {
        volunteer_information: {
          current_status: body.status || Status.NEW,
          volunteer_start_date: body.dateJoined || new Date(),
        },
      }),

      ...(userRoles.includes(UserRole.DONOR) && {
        donor_information: {
          current_status: body.status || Status.ACTIVE,
        },
      }),
    };

    const user = await User.create(userData);
    const userResponse = user.toObject();
    delete (userResponse as { password?: string }).password;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error("POST user error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

// PUT update a user
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body: UserUpdateData = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    // Handle legacy fields
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.role) updateData.role = body.role;

    // Handle personal information updates
    if (body.firstName || body.lastName || body.email || body.phone) {
      updateData["personal_information"] = {};
      if (body.firstName)
        updateData["personal_information.first_name"] = body.firstName;
      if (body.lastName)
        updateData["personal_information.last_name"] = body.lastName;
      if (body.email) updateData["personal_information.email"] = body.email;
      if (body.phone)
        updateData["personal_information.cell_phone"] = body.phone;
    }

    // Handle roles update
    if (body.roles) {
      updateData["general_information.roles"] = body.roles;
    }

    // Handle status updates based on category
    if (body.status && body.category) {
      if (body.category === "clients") {
        updateData["client_information.current_status"] = body.status;
      } else if (body.category === "volunteers") {
        updateData["volunteer_information.current_status"] = body.status;
      } else if (body.category === "donors") {
        updateData["donor_information.current_status"] = body.status;
      }
    }

    // Only update password if provided
    if (body.password && body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(body.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("PUT user error:", error);

    if (
      error instanceof Error &&
      "code" in error &&
      (error as MongoError).code === 11000
    ) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

// DELETE a user
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE user error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
