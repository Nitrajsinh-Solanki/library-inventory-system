import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connect';
import { Book } from '@/lib/models/Book';

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