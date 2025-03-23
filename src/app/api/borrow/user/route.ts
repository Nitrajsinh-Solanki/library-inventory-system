
// library-inventory-system\src\app\api\borrow\user\route.ts



import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb/connect';
import { User } from '@/lib/models/User';
import { Borrow } from '@/lib/models/Borrow';

export async function GET() {
  try {
    await dbConnect();
    
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('auth_token');
    
    if (!authToken || !authToken.value) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const user = await User.findById(authToken.value);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Find all borrows for this user and populate book details
    const borrows = await Borrow.find({ userId: user._id })
      .populate({
        path: 'bookId',
        select: 'title author coverImage isbn'
      })
      .sort({ borrowDate: -1 });
    
    return NextResponse.json({
      borrows: borrows.map(borrow => ({
        _id: borrow._id,
        bookId: {
          _id: borrow.bookId._id,
          title: borrow.bookId.title,
          author: borrow.bookId.author,
          coverImage: borrow.bookId.coverImage,
          isbn: borrow.bookId.isbn
        },
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        returnDate: borrow.returnDate,
        status: borrow.status
      }))
    });
    
  } catch (error) {
    console.error('Error fetching user borrows:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
