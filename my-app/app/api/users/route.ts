import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import User, { UserRole } from "../../../models/User";
import bcrypt from "bcryptjs";
import { Status } from "@/enums/user-enums";

export async function GET(request: Request){
  const db = await connectDB();
  if (!db){
    return NextResponse.json({ message: "Database connection failed" }, { status: 500 });
  }

  try{
    const users = await User.find();
    console.log("this is the users", users);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users", error: (error as Error).message },
      { status: 500 }
    );
  }
};