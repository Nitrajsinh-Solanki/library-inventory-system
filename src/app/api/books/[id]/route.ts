// library-inventory-system\src\app\api\books\[id]\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Book } from '@/lib/models/Book';
import dbConnect from '@/lib/mongodb/connect';
import { getCurrentUser } from '@/lib/utils/auth';
import { deleteFileFromSupabase } from '@/lib/supabase/storage';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    
    const bookId = params.id;
    
    if (!bookId) {
      return NextResponse.json(
        { message: 'Book ID is required' },
        { status: 400 }
      );
    }
    
    const book = await Book.findById(bookId);
    
    if (!book) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { message: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is librarian or admin
    if (user.role !== 'librarian' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const bookId = params.id;
    const data = await request.json();
    
    if (!bookId) {
      return NextResponse.json(
        { message: 'Book ID is required' },
        { status: 400 }
      );
    }
    
    // Find the existing book
    const existingBook = await Book.findById(bookId);
    if (!existingBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    // Handle cover image deletion if changed
    if (data.coverImage && data.coverImage !== existingBook.coverImage) {
      await deleteFileFromSupabase(existingBook.coverImage);
    }
    
    // Find and update the book
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { message: 'Failed to update book' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is librarian or admin
    if (user.role !== 'librarian' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const bookId = params.id;
    
    if (!bookId) {
      return NextResponse.json(
        { message: 'Book ID is required' },
        { status: 400 }
      );
    }
    
    // Find the book to get its image URL
    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    // Delete the cover image from Supabase
    if (book.coverImage) {
      await deleteFileFromSupabase(book.coverImage);
    }
    
    // Delete the book from MongoDB
    const deletedBook = await Book.findByIdAndDelete(bookId);
    
    if (!deletedBook) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { message: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
