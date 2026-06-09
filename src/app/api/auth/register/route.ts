import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, JWTPayload, UserRole } from '@/lib/auth';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, restaurantName } = await req.json();

    if (!name || !email || !password || !restaurantName) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 409 });
    }

    // Generate unique slug for restaurant
    let baseSlug = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!baseSlug) baseSlug = 'restaurant';
    
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.restaurant.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create Restaurant and User in a transaction
    const { user, restaurant } = await prisma.$transaction(async (tx) => {
      const newRestaurant = await tx.restaurant.create({
        data: {
          name: restaurantName,
          slug,
          themeMode: 'LIGHT',
          accentColor: '#E85D04',
          secondaryColor: '#1C1917',
          plan: 'STARTER',
        },
      });

      const newUser = await tx.user.create({
        data: {
          email: cleanEmail,
          password: hashPassword(password),
          name: name.trim(),
          role: 'OWNER',
          restaurantId: newRestaurant.id,
        },
      });

      return { user: newUser, restaurant: newRestaurant };
    });

    // Auto-login
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      restaurantId: user.restaurantId,
      restaurantSlug: restaurant.slug,
    };

    const token = await signToken(payload);
    const redirect = `/admin/${restaurant.slug}`;

    const response = NextResponse.json({ success: true, user: payload, redirect }, { status: 201 });
    response.cookies.set('sa_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription' }, { status: 500 });
  }
}
