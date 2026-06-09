import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, JWTPayload, UserRole } from '@/lib/auth';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { restaurant: { select: { slug: true } } },
    });

    const hashedInput = hashPassword(password);

    if (!user || user.password !== hashedInput) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Compte désactivé' }, { status: 403 });
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      restaurantId: user.restaurantId,
      restaurantSlug: user.restaurant?.slug ?? null,
    };

    const token = await signToken(payload);

    // Determine redirect based on role
    let redirect = '/';
    if (user.role === 'SUPER_ADMIN') redirect = '/superadmin';
    else if (user.role === 'OWNER' || user.role === 'MANAGER') {
      redirect = `/admin/${user.restaurant?.slug || ''}`;
    } else if (user.role === 'KITCHEN') {
      redirect = `/kitchen/${user.restaurant?.slug || ''}`;
    } else if (user.role === 'WAITER') {
      redirect = `/waiter/${user.restaurant?.slug || ''}`;
    }

    const response = NextResponse.json({ success: true, user: payload, redirect });
    response.cookies.set('sa_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
