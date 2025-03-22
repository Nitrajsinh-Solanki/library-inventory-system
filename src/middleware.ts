// library-inventory-system\src\middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  
  // Check if the path is a protected route
  const isManageBooksRoute = request.nextUrl.pathname.startsWith('/manage-books');
  
  // If trying to access protected routes without auth token, redirect to login
  if (isManageBooksRoute && !authToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // For manage-books routes, verify librarian role
  if (isManageBooksRoute && authToken) {
    try {
      // Fetch user data to check role
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || request.nextUrl.origin}/api/auth/me`, {
        headers: {
          Cookie: `auth_token=${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify user');
      }
      
      const userData = await response.json();
      
      // If not a librarian or admin, redirect to unauthorized page
      if (userData.role !== 'librarian' && userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      // If verification fails, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/manage-books/:path*']
};