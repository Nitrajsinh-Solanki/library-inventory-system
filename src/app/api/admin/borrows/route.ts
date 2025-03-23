
// library-inventory-system\src\app\api\admin\borrows\route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb/connect";
import { Borrow } from "@/lib/models/Borrow";
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
    
    // Get all borrows with populated book and user data
    const borrows = await Borrow.find()
      .populate('bookId', 'title author coverImage')
      .populate('userId', 'username email')
      .sort({ borrowDate: -1 });
    
    return NextResponse.json({ borrows });
  } catch (error) {
    console.error("Error fetching borrows:", error);
    return NextResponse.json(
      { error: "Failed to fetch borrows" },
      { status: 500 }
    );
  }
}
