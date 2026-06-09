import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createHash } from 'crypto';

function hashPassword(p: string) {
  return createHash('sha256').update(p + 'skanit_salt').digest('hex');
}

// GET — list users for a restaurant
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !['SUPER_ADMIN', 'OWNER', 'MANAGER'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const restaurantSlug = searchParams.get('restaurantSlug');

  const restaurant = restaurantSlug
    ? await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } })
    : null;

  const restaurantId = user.role === 'SUPER_ADMIN'
    ? (restaurant?.id || undefined)
    : (user.restaurantId || undefined);

  const users = await prisma.user.findMany({
    where: { restaurantId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });

  return NextResponse.json(users);
}

// POST — create team member
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !['SUPER_ADMIN', 'OWNER', 'MANAGER'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { name, email, password, role, restaurantSlug } = await req.json();

  let restaurantId = user.restaurantId;
  if (user.role === 'SUPER_ADMIN' && restaurantSlug) {
    const r = await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
    restaurantId = r?.id || null;
  }

  const allowedRoles = user.role === 'SUPER_ADMIN'
    ? ['OWNER', 'MANAGER', 'KITCHEN', 'WAITER']
    : ['MANAGER', 'KITCHEN', 'WAITER'];

  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'Role not allowed' }, { status: 403 });
  }

  const newUser = await prisma.user.create({
    data: {
      name, email: email.toLowerCase().trim(),
      password: hashPassword(password), role, restaurantId,
    },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });

  return NextResponse.json(newUser, { status: 201 });
}

// PATCH — update user (toggle active, change role)
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !['SUPER_ADMIN', 'OWNER', 'MANAGER'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id, isActive, role } = await req.json();

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(isActive !== undefined && { isActive }),
      ...(role && { role }),
    },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });

  return NextResponse.json(updated);
}

// DELETE — remove team member
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !['SUPER_ADMIN', 'OWNER'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
