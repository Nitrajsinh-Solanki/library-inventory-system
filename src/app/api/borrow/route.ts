// library-inventory-system\src\app\api\borrow\route.ts




import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connect';
import { Book } from '@/lib/models/Book';
import { Borrow } from '@/lib/models/Borrow';
import { getCurrentUser } from '@/lib/utils/auth';
import { getFareSettings } from '@/lib/utils/fare';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.bookId || !data.dueDate) {
      return NextResponse.json(
        { message: 'Book ID and due date are required' },
        { status: 400 }
      );
    }
    
    // Find the book
    const book = await Book.findById(data.bookId);
    
    if (!book) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Check if book is available
    if (book.availableCopies <= 0) {
      return NextResponse.json(
        { message: 'This book is currently not available for borrowing' },
        { status: 400 }
      );
    }
    
    // Get fare settings
    const fareSettings = await getFareSettings();
    
    // Create borrow record
    const borrow = new Borrow({
      userId: user._id,
      bookId: data.bookId,
      borrowDate: new Date(),
      dueDate: new Date(data.dueDate),
      borrowFee: fareSettings.borrowFee,
      status: 'borrowed'
    });
    
    // Save borrow record
    await borrow.save();
    
    // Update book availability
    book.availableCopies -= 1;
    book.available = book.availableCopies > 0;
    await book.save();
    
    return NextResponse.json({
      message: 'Book borrowed successfully',
      borrow: {
        id: borrow._id,
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        borrowFee: borrow.borrowFee
      }
    });
  } catch (error) {
    console.error('Error borrowing book:', error);
    return NextResponse.json(
      { message: 'Failed to borrow book' },
      { status: 500 }
    );
  }
}

// Get all borrows for the current user
export async function GET() {
  try {
    await dbConnect();
    
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Find all borrows for this user
    const borrows = await Borrow.find({ userId: user._id })
      .populate('bookId', 'title author coverImage')
      .sort({ borrowDate: -1 });
    
    return NextResponse.json(borrows);
  } catch (error) {
    console.error('Error fetching borrows:', error);
    return NextResponse.json(
      { message: 'Failed to fetch borrows' },
      { status: 500 }
    );
  }
}