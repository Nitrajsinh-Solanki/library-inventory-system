// library-inventory-system\src\lib\utils\auth.ts

import { cookies } from 'next/headers';
import { User } from '@/lib/models/User';
import dbConnect from '@/lib/mongodb/connect';

/**
 * Gets the current authenticated user from the auth token cookie
 * @returns The user object or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    await dbConnect();
    
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('auth_token');
    
    if (!authToken || !authToken.value) {
      return null;
    }
    
    const user = await User.findById(authToken.value).select('-password');
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Checks if the current user has librarian or admin privileges
 * @returns Boolean indicating if user is a librarian or admin
 */
export async function isLibrarian() {
  const user = await getCurrentUser();
  return user && (user.role === 'librarian' || user.role === 'admin');
}

/**
 * Checks if the current user is an admin
 * @returns Boolean indicating if user is an admin
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user && user.role === 'admin';
}

/**
 * Validates a password against common security requirements
 * @param password The password to validate
 * @returns Object containing validation result and error message
 */
export function validatePassword(password: string) {
  if (password.length < 8) {
    return { 
      isValid: false, 
      message: 'Password must be at least 8 characters long' 
    };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one uppercase letter' 
    };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one lowercase letter' 
    };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one number' 
    };
  }
  
  return { isValid: true, message: '' };
}

/**
 * Client-side function to check if user is authenticated
 * @returns Promise resolving to boolean indicating authentication status
 */
export async function isAuthenticated() {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Client-side function to get the current user's role
 * @returns Promise resolving to the user's role or null
 */
export async function getUserRole() {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const user = await response.json();
    return user.role;
  } catch (error) {
    return null;
  }
}
