import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { decryptSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const session = decryptSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ error: 'Session expired or invalid.' }, { status: 401 });
    }

    const { nodeId } = await req.json();
    if (!nodeId) {
      return NextResponse.json({ error: 'Node ID is required.' }, { status: 400 });
    }

    const db = readDB();
    const existingIndex = db.roadmapProgress.findIndex(
      (p) => p.userId === session.userId && p.nodeId === nodeId
    );

    let isCompleted = false;

    if (existingIndex > -1) {
      // Unmark completion
      db.roadmapProgress.splice(existingIndex, 1);
    } else {
      // Mark completion
      db.roadmapProgress.push({
        userId: session.userId,
        nodeId,
        completedAt: new Date().toISOString(),
      });
      isCompleted = true;
    }

    writeDB(db);

    // Return the list of all completed node IDs for this user
    const completedNodeIds = db.roadmapProgress
      .filter((p) => p.userId === session.userId)
      .map((p) => p.nodeId);

    return NextResponse.json({
      success: true,
      isCompleted,
      completedNodeIds,
    });
  } catch (error) {
    console.error('Progress toggle error:', error);
    return NextResponse.json({ error: 'Internal server error updating progress.' }, { status: 500 });
  }
}
