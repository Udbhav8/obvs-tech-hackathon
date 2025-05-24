import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import UserModel from "../../../models/User";
import { IUser } from "../../../models/User";
import { Model } from "mongoose";
import bcrypt from "bcryptjs";

// Explicitly type UserModel
const User: Model<IUser> = UserModel;

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

    const query: any = {};
    if (category) {
      query.category = category;
    }

    const users = await User.find(query).select("-password").sort({ name: 1 });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create user with all fields
    const userData = {
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone || "",
      address: body.address || "",
      category: body.category || "clients",
      position: body.position || "",
      dateJoined: body.dateJoined || new Date(),
      role: body.role || "user",
    };

    const user = await User.create(userData);
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a user
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    const updateData: any = {
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      address: body.address || "",
      category: body.category || "clients",
      position: body.position || "",
      dateJoined: body.dateJoined,
      role: body.role,
    };

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
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a user
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
