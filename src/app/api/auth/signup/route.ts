import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { hashPassword, encryptSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields (name, email, password) are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const db = readDB();
    const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 409 });
    }

    const newUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      name,
      tier: 'free' as const,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDB(db);

    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    const sessionToken = encryptSession({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      tier: newUser.tier,
      exp,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        tier: newUser.tier,
      },
    });

    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error during registration.' }, { status: 500 });
  }
}
