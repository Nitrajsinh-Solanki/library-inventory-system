// library-inventory-system\src\app\api\admin\users\[id]\demote\route.ts


import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb/connect";
import { User } from "@/lib/models/User";
import { getCurrentUser } from "@/lib/utils/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const userId = params.id;
    
    // Find the user to demote
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Check if user is already a regular user
    if (user.role === "user") {
      return NextResponse.json(
        { error: "User is already a regular user" },
        { status: 400 }
      );
    }
    
    // Check if user is an admin (admins cannot be demoted through this endpoint)
    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Admin users cannot be demoted through this endpoint" },
        { status: 400 }
      );
    }
    
    // Update user role to regular user
    user.role = "user";
    await user.save();
    
    return NextResponse.json({
      message: "Librarian demoted to regular user successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error demoting librarian:", error);
    return NextResponse.json(
      { error: "Failed to demote librarian" },
      { status: 500 }
    );
  }
}
