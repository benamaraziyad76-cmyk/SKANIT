import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const restaurantSlug = searchParams.get('restaurantSlug');

    if (!restaurantSlug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

    try {
        const ingredients = await prisma.ingredient.findMany({
            where: { restaurant: { slug: restaurantSlug } },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(ingredients);
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, stock, minStock, unit, restaurantSlug } = body;

        const restaurant = await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
        if (!restaurant) return NextResponse.json({ error: 'No resto' }, { status: 404 });

        const ingredient = await prisma.ingredient.create({
            data: { name, stock: parseFloat(stock), minStock: parseFloat(minStock), unit, restaurantId: restaurant.id }
        });
        return NextResponse.json(ingredient);
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        const updated = await prisma.ingredient.update({
            where: { id },
            data: {
                ...data,
                stock: data.stock !== undefined ? parseFloat(data.stock) : undefined,
                minStock: data.minStock !== undefined ? parseFloat(data.minStock) : undefined,
            }
        });
        return NextResponse.json(updated);
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
        await prisma.ingredient.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
