import fs from 'fs';
import path from 'path';

// Database Schema interfaces
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  tier: 'free' | 'premium';
  createdAt: string;
}

export interface SolvedProblem {
  userId: string;
  problemId: string;
  status: 'attempted' | 'solved';
  code: string;
  language: string;
  solvedAt: string;
}

export interface RoadmapProgress {
  userId: string;
  nodeId: string;
  completedAt: string;
}

export interface PaymentLog {
  id: string;
  userId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  status: 'created' | 'verified' | 'failed';
  createdAt: string;
}

interface DatabaseState {
  users: User[];
  solvedProblems: SolvedProblem[];
  roadmapProgress: RoadmapProgress[];
  payments: PaymentLog[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure DB file exists
function initDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialState: DatabaseState = {
      users: [],
      solvedProblems: [],
      roadmapProgress: [],
      payments: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2), 'utf-8');
  }
}

// Read database file
export function readDB(): DatabaseState {
  initDatabase();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read database file, returning initial state", error);
    return { users: [], solvedProblems: [], roadmapProgress: [], payments: [] };
  }
}

// Write to database file
export function writeDB(state: DatabaseState): void {
  initDatabase();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to write to database file", error);
  }
}
