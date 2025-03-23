// library-inventory-system\src\app\api\admin\users\[id]\promote\route.ts


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
    
    // Find the user to promote
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Check if user is already a librarian or admin
    if (user.role === "librarian" || user.role === "admin") {
      return NextResponse.json(
        { error: "User is already a librarian or admin" },
        { status: 400 }
      );
    }
    
    // Update user role to librarian
    user.role = "librarian";
    await user.save();
    
    return NextResponse.json({
      message: "User promoted to librarian successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error promoting user:", error);
    return NextResponse.json(
      { error: "Failed to promote user" },
      { status: 500 }
    );
  }
}
