import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password + 'skanit_salt').digest('hex');
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { restaurant: { select: { name: true, slug: true } } },
    omit: { password: true },
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { name, email, password, role, restaurantId } = await req.json();
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase().trim(),
      password: hashPassword(password),
      role,
      restaurantId: restaurantId || null,
    },
  });

  return NextResponse.json({ ...newUser, password: undefined }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id, isActive, role, restaurantId } = await req.json();
  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(isActive !== undefined && { isActive }),
      ...(role && { role }),
      ...(restaurantId !== undefined && { restaurantId }),
    },
  });

  return NextResponse.json({ ...updated, password: undefined });
}
