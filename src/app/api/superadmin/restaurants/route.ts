import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const restaurants = await prisma.restaurant.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true, users: true, tables: true } },
    },
  });

  return NextResponse.json(restaurants);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { name, slug, address, phone, plan } = await req.json();
  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug required' }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.create({
    data: { name, slug: slug.toLowerCase().replace(/\s+/g, '-'), address, phone, plan: plan || 'STARTER' },
  });

  return NextResponse.json(restaurant, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id, isActive, plan } = await req.json();
  const updated = await prisma.restaurant.update({
    where: { id },
    data: { ...(isActive !== undefined && { isActive }), ...(plan && { plan }) },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.restaurant.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
