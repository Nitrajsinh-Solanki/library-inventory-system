// library-inventory-system\src\app\api\borrow\all\route.ts




import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connect';
import { Borrow } from '@/lib/models/Borrow';
import { getCurrentUser } from '@/lib/utils/auth';
import { getFareSettings } from '@/lib/utils/fare';

export async function GET(request: NextRequest) {
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
    
    // Get fare settings for late fee calculation
    const fareSettings = await getFareSettings();
    
    // Find all active borrows
    const borrows = await Borrow.find({ 
      status: { $in: ['borrowed', 'overdue'] } 
    })
      .populate('userId', 'name email')
      .populate('bookId', 'title author coverImage')
      .sort({ dueDate: 1 });
    
    // Calculate remaining days and potential fees
    const today = new Date();
    const borrowsWithDetails = borrows.map(borrow => {
      const dueDate = new Date(borrow.dueDate);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let fee = borrow.borrowFee || 0;
      let status = borrow.status;
      
      // If overdue, calculate late fee
      if (diffDays < 0) {
        fee += Math.abs(diffDays) * fareSettings.lateFeePerDay;
        status = 'overdue';
      }
      
      return {
        ...borrow.toObject(),
        remainingDays: diffDays,
        totalFee: fee,
        status: status
      };
    });
    
    return NextResponse.json(borrowsWithDetails);
  } catch (error) {
    console.error('Error fetching borrows:', error);
    return NextResponse.json(
      { message: 'Failed to fetch borrows' },
      { status: 500 }
    );
  }
}
