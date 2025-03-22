// library-inventory-system\src\app\api\books\[id]\route.ts


import { NextRequest, NextResponse } from 'next/server';
import { Book } from '@/lib/models/Book';
import dbConnect from '@/lib/mongodb/connect';
import { getCurrentUser } from '@/lib/utils/auth';
import { deleteFileFromSupabase } from '@/lib/supabase/storage';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    const data = await request.json();
    
    // Find the existing book
    const existingBook = await Book.findById(id);
    if (!existingBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    // If cover image is being updated, delete the old one from Supabase
    if (data.coverImage && data.coverImage !== existingBook.coverImage) {
      await deleteFileFromSupabase(existingBook.coverImage);
    }
    
    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(id, data, { new: true });
    
    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    
    // Find the book to get its image URL
    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    // Delete the cover image from Supabase
    if (book.coverImage) {
      await deleteFileFromSupabase(book.coverImage);
    }
    
    // Delete the book from MongoDB
    await Book.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    const book = await Book.findById(id);
    
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
