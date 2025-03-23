// library-inventory-system\src\app\api\admin\users\route.ts


import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb/connect";
import { User } from "@/lib/models/User";
import { getCurrentUser } from "@/lib/utils/auth";

export async function GET() {
  try {
    await dbConnect();
    
    // Check if the current user is an admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Get all users except admins, excluding password field
    const users = await User.find(
      { role: { $ne: "admin" } },
      { password: 0, otp: 0 }
    ).sort({ createdAt: -1 });
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
