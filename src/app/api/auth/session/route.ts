import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ user: null });
    }

    const session = decryptSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const db = readDB();
    const liveUser = db.users.find((u) => u.id === session.userId);

    if (!liveUser) {
      // User deleted or invalid
      const response = NextResponse.json({ user: null });
      response.cookies.set('session', '', { expires: new Date(0), path: '/' });
      return response;
    }

    return NextResponse.json({
      user: {
        id: liveUser.id,
        name: liveUser.name,
        email: liveUser.email,
        tier: liveUser.tier,
      },
    });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ error: 'Internal server error checking session.' }, { status: 500 });
  }
}
