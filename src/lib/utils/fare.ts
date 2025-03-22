// library-inventory-system\src\lib\utils\fare.ts



import { FareSetting } from '@/lib/models/FareSetting';
import dbConnect from '@/lib/mongodb/connect';

// Default fare settings
const DEFAULT_FARE_SETTINGS = {
  borrowDuration: 14,
  borrowFee: 0,
  lateFeePerDay: 1,
  maxBorrowDuration: 30,
  currency: '$'
};

/**
 * Gets the current fare settings from the database
 * @returns The fare settings or default values if none exist
 */
export async function getFareSettings() {
  try {
    await dbConnect();
    
    const settings = await FareSetting.findOne().sort({ updatedAt: -1 });
    
    if (!settings) {
      // Return default values if no settings exist
      return DEFAULT_FARE_SETTINGS;
    }
    
    return settings;
  } catch (error) {
    console.error('Error fetching fare settings:', error);
    
    // Return default values on error
    return DEFAULT_FARE_SETTINGS;
  }
}

/**
 * Calculates the late fee for a book that is overdue
 * @param dueDate The date the book was due
 * @returns Object containing the late fee and days overdue
 */
export async function calculateLateFee(dueDate: Date) {
  try {
    const settings = await getFareSettings();
    
    const today = new Date();
    const due = new Date(dueDate);
    
    // If not overdue, return 0
    if (today <= due) {
      return {
        daysOverdue: 0,
        lateFee: 0,
        currency: settings.currency
      };
    }
    
    // Calculate days overdue (rounded up)
    const diffTime = Math.abs(today.getTime() - due.getTime());
    const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate late fee
    const lateFee = daysOverdue * settings.lateFeePerDay;
    
    return {
      daysOverdue,
      lateFee,
      currency: settings.currency
    };
  } catch (error) {
    console.error('Error calculating late fee:', error);
    
    // Return default values on error
    return {
      daysOverdue: 0,
      lateFee: 0,
      currency: '$'
    };
  }
}

/**
 * Calculates the due date based on current fare settings
 * @param startDate Optional start date (defaults to today)
 * @returns The calculated due date
 */
export async function calculateDueDate(startDate = new Date()) {
  try {
    const settings = await getFareSettings();
    
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + settings.borrowDuration);
    
    return dueDate;
  } catch (error) {
    console.error('Error calculating due date:', error);
    
    // Return default due date (14 days from now) on error
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    return defaultDueDate;
  }
}
