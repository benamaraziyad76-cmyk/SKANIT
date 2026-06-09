import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/menu?restaurantSlug=le-jardin
export async function GET(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('restaurantSlug') || user.restaurantSlug;

    // Enforce user can only access their own restaurant
    if (user.role !== 'SUPER_ADMIN' && user.restaurantSlug !== slug) {
         return NextResponse.json({ error: 'Accès interdit' }, { status: 403 });
    }

    const restaurant = await prisma.restaurant.findUnique({
        where: { slug },
        include: {
            categories: {
                orderBy: { sortOrder: 'asc' },
                include: {
                    items: {
                        orderBy: { sortOrder: 'asc' },
                        include: {
                            optionGroups: {
                                orderBy: { sortOrder: 'asc' },
                                include: { options: { orderBy: { sortOrder: 'asc' } } },
                            },
                            allergens: { include: { allergen: true } },
                        },
                    },
                },
            },
            allergens: true,
        },
    });

    if (!restaurant) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(restaurant);
}

// POST /api/admin/menu - Create menu item
export async function POST(request: Request) {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'OWNER' && user.role !== 'MANAGER')) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { categoryId, name, description, price, image, tags, isSignature, isAvailable } = body;

        const item = await prisma.menuItem.create({
            data: {
                name,
                description: description || null,
                price: parseFloat(price),
                image: image || null,
                tags: tags || null,
                isSignature: isSignature || false,
                isAvailable: isAvailable !== false,
                categoryId,
            },
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error('Error creating menu item:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/admin/menu - Update menu item
export async function PATCH(request: Request) {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'OWNER' && user.role !== 'MANAGER')) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, ...data } = body;

        if (data.price) data.price = parseFloat(data.price);

        const { optionGroups, ...itemData } = data;

        const item = await prisma.menuItem.update({
            where: { id },
            data: {
                ...itemData,
                optionGroups: optionGroups ? {
                    deleteMany: {},
                    create: optionGroups.map((group: any) => ({
                        name: group.name,
                        type: group.type,
                        required: group.required,
                        sortOrder: group.sortOrder,
                        options: {
                            create: group.options.map((opt: any) => ({
                                name: opt.name,
                                priceDelta: parseFloat(opt.priceDelta) || 0,
                                isDefault: opt.isDefault,
                                sortOrder: opt.sortOrder,
                            })),
                        },
                    })),
                } : undefined,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error('Error updating menu item:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/menu
export async function DELETE(request: Request) {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'OWNER' && user.role !== 'MANAGER')) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    try {
        await prisma.menuItem.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
