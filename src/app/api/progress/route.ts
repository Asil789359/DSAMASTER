import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ solvedProblems: [], completedNodeIds: [] });
    }

    const session = decryptSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ solvedProblems: [], completedNodeIds: [] });
    }

    const db = readDB();
    const solvedProblems = db.solvedProblems
      .filter((p) => p.userId === session.userId)
      .map((p) => ({
        problemId: p.problemId,
        status: p.status,
        language: p.language,
        solvedAt: p.solvedAt,
      }));

    const completedNodeIds = db.roadmapProgress
      .filter((p) => p.userId === session.userId)
      .map((p) => p.nodeId);

    return NextResponse.json({
      solvedProblems,
      completedNodeIds,
    });
  } catch (error) {
    console.error('Fetch progress error:', error);
    return NextResponse.json({ error: 'Internal server error fetching progress.' }, { status: 500 });
  }
}
