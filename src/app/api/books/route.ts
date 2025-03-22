// library-inventory-system\src\app\api\books\route.ts


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connect';
import { Book } from '@/lib/models/Book';
import { cookies } from 'next/headers';
import { User } from '@/lib/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all books
    const books = await Book.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(books);
    
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { message: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Get user ID from cookie
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('auth_token');
    
    if (!authToken || !authToken.value) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Verify user is a librarian or admin
    const user = await User.findById(authToken.value);
    if (!user || (user.role !== 'librarian' && user.role !== 'admin')) {
      return NextResponse.json(
        { message: 'Unauthorized: Only librarians can add books' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const bookData = await request.json();
    
    // Add the user ID as the addedBy field
    bookData.addedBy = user._id;
    
    // Set availableCopies equal to totalCopies initially
    if (bookData.totalCopies) {
      bookData.availableCopies = bookData.totalCopies;
    }
    
    // Create new book
    const newBook = await Book.create(bookData);
    
    return NextResponse.json(newBook, { status: 201 });
    
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json(
      { message: 'Failed to add book' },
      { status: 500 }
    );
  }
}