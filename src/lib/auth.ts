import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'skanit-super-secret-key-2024-change-in-production'
);

export type UserRole = 'SUPER_ADMIN' | 'OWNER' | 'MANAGER' | 'WAITER' | 'KITCHEN';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  restaurantId?: string | null;
  restaurantSlug?: string | null;
}

// Sign a JWT token (valid 7 days)
export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// Get current user from cookies (server-side)
export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sa_token')?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

// Check if user has required role(s)
export function hasRole(user: JWTPayload | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

// Role hierarchy check (SUPER_ADMIN > OWNER > MANAGER > WAITER/KITCHEN)
export function canAccess(user: JWTPayload | null, minRole: UserRole): boolean {
  if (!user) return false;
  const hierarchy: UserRole[] = ['KITCHEN', 'WAITER', 'MANAGER', 'OWNER', 'SUPER_ADMIN'];
  const userLevel = hierarchy.indexOf(user.role);
  const requiredLevel = hierarchy.indexOf(minRole);
  return userLevel >= requiredLevel;
}
