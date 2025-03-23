// library-inventory-system\src\app\api\admin\borrows\[id]\return\route.ts



import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb/connect";
import { Borrow } from "@/lib/models/Borrow";
import { Book } from "@/lib/models/Book";
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
    
    const borrowId = params.id;
    
    // Find the borrow record
    const borrow = await Borrow.findById(borrowId);
    
    if (!borrow) {
      return NextResponse.json(
        { error: "Borrow record not found" },
        { status: 404 }
      );
    }
    
    // Check if the book is already returned
    if (borrow.status === "returned") {
      return NextResponse.json(
        { error: "Book is already marked as returned" },
        { status: 400 }
      );
    }
    
    // Calculate fine if the book is overdue
    const dueDate = new Date(borrow.dueDate);
    const today = new Date();
    let fine = 0;
    
    if (today > dueDate) {
      // Calculate days overdue
      const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      // Assume $0.50 per day overdue
      fine = daysOverdue * 0.5;
    }
    
    // Update the borrow record
    borrow.status = "returned";
    borrow.returnDate = new Date();
    borrow.fine = fine;
    await borrow.save();
    
    // Update the book's availability
    await Book.findByIdAndUpdate(borrow.bookId, { isAvailable: true });
    
    return NextResponse.json({
      message: "Book marked as returned successfully",
      borrow: {
        _id: borrow._id,
        status: borrow.status,
        returnDate: borrow.returnDate,
        fine: borrow.fine
      }
    });
  } catch (error) {
    console.error("Error marking book as returned:", error);
    return NextResponse.json(
      { error: "Failed to mark book as returned" },
      { status: 500 }
    );
  }
}
