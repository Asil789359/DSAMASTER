import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: problemId } = await params;
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const session = decryptSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: 'Session expired or invalid.' }, { status: 401 });
    }

    const { code, language, status } = await req.json();
    if (!code || !language || !status) {
      return NextResponse.json({ error: 'Code, language, and status are required fields.' }, { status: 400 });
    }

    const db = readDB();

    // Check if progress already exists
    const existingIndex = db.solvedProblems.findIndex(
      (p) => p.userId === session.userId && p.problemId === problemId
    );

    const submissionData = {
      userId: session.userId,
      problemId,
      status: status as 'solved' | 'attempted',
      code,
      language,
      solvedAt: new Date().toISOString(),
    };

    if (existingIndex > -1) {
      // If already solved, do not downgrade to attempted.
      if (db.solvedProblems[existingIndex].status === 'solved' && status === 'attempted') {
        submissionData.status = 'solved';
      }
      db.solvedProblems[existingIndex] = submissionData;
    } else {
      db.solvedProblems.push(submissionData);
    }

    writeDB(db);

    return NextResponse.json({
      success: true,
      status: submissionData.status,
    });
  } catch (error) {
    console.error('Submission API error:', error);
    return NextResponse.json({ error: 'Internal server error processing submission.' }, { status: 500 });
  }
}
