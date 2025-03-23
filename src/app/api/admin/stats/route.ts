// library-inventory-system\src\app\api\admin\stats\route.ts


import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb/connect";
import { User } from "@/lib/models/User";
import { Book } from "@/lib/models/Book";
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
    
    // Get total users count
    const totalUsers = await User.countDocuments({ role: "user" });
    
    // Get total librarians count
    const totalLibrarians = await User.countDocuments({ role: "librarian" });
    
    // Get total books count
    const totalBooks = await Book.countDocuments();
    
    // Get active borrows count
    const activeBorrows = await Borrow.countDocuments({ status: "borrowed" });
    
    // Get overdue books count
    const today = new Date();
    const overdueBooks = await Borrow.countDocuments({
      status: "borrowed",
      dueDate: { $lt: today }
    });
    
    return NextResponse.json({
      totalUsers,
      totalLibrarians,
      totalBooks,
      activeBorrows,
      overdueBooks
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}
