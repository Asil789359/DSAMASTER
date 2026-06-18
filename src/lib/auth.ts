import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'algomaster-platform-super-secret-key-32-chars-long';
// Ensure key is exactly 32 bytes
const KEY = Buffer.from(SESSION_SECRET.padEnd(32).slice(0, 32));
const IV_LENGTH = 16;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
    return hash === originalHash;
  } catch (e) {
    return false;
  }
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  tier: 'free' | 'premium';
  exp: number;
}

export function encryptSession(payload: SessionPayload): string {
  const text = JSON.stringify(payload);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptSession(token: string): SessionPayload | null {
  try {
    const parts = token.split(':');
    const ivHex = parts.shift();
    const encryptedHex = parts.join(':');
    if (!ivHex || !encryptedHex) return null;
    
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    const session = JSON.parse(decrypted.toString()) as SessionPayload;
    // Check expiration
    if (Date.now() > session.exp) {
      return null;
    }
    return session;
  } catch (error) {
    return null;
  }
}
