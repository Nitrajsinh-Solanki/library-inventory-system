

// library-inventory-system\src\app\api\fare-settings\route.ts


import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/connect';
import { FareSetting } from '@/lib/models/FareSetting';
import { isLibrarian } from '@/lib/utils/auth';

export async function GET() {
  try {
    await dbConnect();
    
    // Get the first (and usually only) fare settings document
    // If none exists, we'll return null and let the frontend use defaults
    const settings = await FareSetting.findOne().sort({ updatedAt: -1 });
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching fare settings:', error);
    return NextResponse.json(
      { message: 'Failed to fetch fare settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if user has librarian or admin privileges
    const hasPermission = await isLibrarian();
    if (!hasPermission) {
      return NextResponse.json(
        { message: 'Unauthorized: Librarian privileges required' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (
      typeof data.borrowDuration !== 'number' ||
      typeof data.borrowFee !== 'number' ||
      typeof data.lateFeePerDay !== 'number' ||
      typeof data.maxBorrowDuration !== 'number' ||
      !data.currency
    ) {
      return NextResponse.json(
        { message: 'Invalid fare settings data' },
        { status: 400 }
      );
    }
    
    // Additional validation
    if (data.borrowDuration <= 0) {
      return NextResponse.json(
        { message: 'Borrow duration must be greater than 0' },
        { status: 400 }
      );
    }
    
    if (data.lateFeePerDay < 0) {
      return NextResponse.json(
        { message: 'Late fee cannot be negative' },
        { status: 400 }
      );
    }
    
    if (data.maxBorrowDuration < data.borrowDuration) {
      return NextResponse.json(
        { message: 'Maximum borrow duration cannot be less than default borrow duration' },
        { status: 400 }
      );
    }
    
    // Find existing settings or create new one
    let settings = await FareSetting.findOne();
    
    if (settings) {
      // Update existing settings
      settings.borrowDuration = data.borrowDuration;
      settings.borrowFee = data.borrowFee;
      settings.lateFeePerDay = data.lateFeePerDay;
      settings.maxBorrowDuration = data.maxBorrowDuration;
      settings.currency = data.currency;
      await settings.save();
    } else {
      // Create new settings
      settings = await FareSetting.create({
        borrowDuration: data.borrowDuration,
        borrowFee: data.borrowFee,
        lateFeePerDay: data.lateFeePerDay,
        maxBorrowDuration: data.maxBorrowDuration,
        currency: data.currency
      });
    }
    
        return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating fare settings:', error);
    return NextResponse.json(
      { message: 'Failed to update fare settings' },
      { status: 500 }
    );
  }
}

