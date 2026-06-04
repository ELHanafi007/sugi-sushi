import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// POST handler for cashier login
export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.CASHIER_PASSWORD) {
    const response = NextResponse.json({ success: true });
    
    // Set a session cookie
    (await cookies()).set('cashier_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
}
