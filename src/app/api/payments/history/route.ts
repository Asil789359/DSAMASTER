import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const session = decryptSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: 'Session expired or invalid.' }, { status: 401 });
    }

    const db = readDB();
    const userPayments = db.payments
      .filter((p) => p.userId === session.userId)
      .map((p) => ({
        id: p.id,
        orderId: p.orderId,
        amount: p.amount,
        status: p.status,
        createdAt: p.createdAt,
      }));

    return NextResponse.json({
      success: true,
      payments: userPayments,
    });
  } catch (error) {
    console.error('Fetch payments history error:', error);
    return NextResponse.json({ error: 'Internal server error fetching billing logs.' }, { status: 500 });
  }
}
