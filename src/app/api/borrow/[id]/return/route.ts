// library-inventory-system\src\app\api\borrow\[id]\return\route.ts



import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connect';
import { Borrow } from '@/lib/models/Borrow';
import { Book } from '@/lib/models/Book';
import { getCurrentUser } from '@/lib/utils/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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
    
    // Check if user is librarian or admin
    if (user.role !== 'librarian' && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const borrowId = params.id;
    
    if (!borrowId) {
      return NextResponse.json(
        { message: 'Borrow ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`Processing return for borrow ID: ${borrowId}`);
    
    let data;
    try {
      data = await request.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Find the borrow record
    const borrow = await Borrow.findById(borrowId);
    
    if (!borrow) {
      console.log(`Borrow record not found for ID: ${borrowId}`);
      return NextResponse.json(
        { message: 'Borrow record not found' },
        { status: 404 }
      );
    }
    
    // Check if already returned
    if (borrow.status === 'returned') {
      console.log(`Book already returned for borrow ID: ${borrowId}`);
      return NextResponse.json(
        { message: 'This book has already been returned' },
        { status: 400 }
      );
    }
    
    console.log(`Updating borrow record: ${borrowId}`);
    
    // Update borrow record
    borrow.status = 'returned';
    borrow.returnDate = new Date(data.returnDate || new Date());
    borrow.feeCollected = data.feeCollected;
    
    await borrow.save();
    
    // Update book availability
    const book = await Book.findById(borrow.bookId);
    
    if (book) {
      console.log(`Updating book availability for book ID: ${book._id}`);
      book.availableCopies += 1;
      book.available = true;
      await book.save();
    }
    
    console.log(`Return successful for borrow ID: ${borrowId}`);
    
    return NextResponse.json({
      message: 'Book returned successfully',
      borrow: {
        id: borrow._id,
        returnDate: borrow.returnDate,
        status: borrow.status
      }
    });
  } catch (error) {
    console.error('Error returning book:', error);
    return NextResponse.json(
      { message: 'Failed to return book' },
      { status: 500 }
    );
  }
}
