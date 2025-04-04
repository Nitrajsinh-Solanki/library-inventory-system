// library-inventory-system\src\app\api\auth\logout\route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    
    (await cookieStore).delete('auth_token');
    
    return NextResponse.json({ 
      message: 'Logged out successfully' 
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}