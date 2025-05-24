import { NextRequest } from "next/server";
import connectDB from "../../../../lib/mongodb";
import User, {  UserRole } from "../../../../models/User";

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const requestData: RegistrationData = await req.json();
    const { name, email, password, firstName, lastName, roles } = requestData;

    // Validate input
    if (!email || !password) {
      return Response.json(
        { message: "Please provide email and password" },
        { status: 400 }
      );
    }

    if (!name && (!firstName || !lastName)) {
      return Response.json(
        { message: "Please provide either full name or first and last name" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists (check both email fields)
    const existingUser = await User.findOne({
      $and: [{ "personal_information.email": email }, { email: email }],
    });

    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    // Parse name if provided as single field
    let first_name = firstName;
    let last_name = lastName;

    if (name && !firstName && !lastName) {
      const nameParts = name.trim().split(/\s+/);
      first_name = nameParts[0];
      last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    }

    // Set default roles
    const userRoles = roles && roles.length > 0 ? roles : [UserRole.ADMIN];

    // Create new user with comprehensive schema
    const userData = {
      // Legacy fields for backward compatibility
      name: name || `${first_name} ${last_name}`.trim(),
      email: email,
      password: password,
      role: "admin", // Default legacy role

      // New schema structure
      general_information: {
        roles: userRoles,
        enews_subscription: false,
        letter_mail_subscription: false,
      },

      personal_information: {
        first_name: first_name || name || "",
        last_name: last_name || "",
        email: email,
      },
    };

    const user = await User.create(userData);

    return Response.json(
      {
        message: "User created successfully",
        user: {
          id: user._id.toString(),
          email: user.personal_information?.email ?? "",
          name: user.personal_information?.first_name ?? "",
          roles: user.general_information?.roles || [UserRole.ADMIN],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return Response.json(
        { message: "Invalid user data provided" },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return Response.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    return Response.json({ message: "Error creating user" }, { status: 500 });
  }
}
