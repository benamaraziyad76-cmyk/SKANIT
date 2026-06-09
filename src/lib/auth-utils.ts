import { createHash } from 'crypto';

export function hashPassword(password: string): string {
  // Simple SHA-256 hash
  return createHash('sha256').update(password + 'skanit_salt').digest('hex');
}
