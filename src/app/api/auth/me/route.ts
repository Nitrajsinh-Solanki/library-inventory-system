import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb/connect';
import { User } from '@/lib/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const cookieStore = cookies();
    const authToken =  (await cookieStore).get('auth_token');
    
    if (!authToken || !authToken.value) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const user = await User.findById(authToken.value).select('-password -otp');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}