import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { restaurantSlug, tableCode, items, notes } = body;

        // Find restaurant
        const restaurant = await prisma.restaurant.findUnique({
            where: { slug: restaurantSlug },
        });
        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        // Find or create table
        let table = await prisma.restaurantTable.findUnique({
            where: {
                restaurantId_tableCode: {
                    restaurantId: restaurant.id,
                    tableCode,
                },
            },
        });
        if (!table) {
            table = await prisma.restaurantTable.create({
                data: {
                    label: `Table ${tableCode}`,
                    tableCode,
                    restaurantId: restaurant.id,
                }
            });
        }

        // Get next order number
        const lastOrder = await prisma.order.findFirst({
            where: { restaurantId: restaurant.id },
            orderBy: { orderNumber: 'desc' },
        });
        const orderNumber = (lastOrder?.orderNumber || 0) + 1;

        // Calculate total
        let total = 0;
        for (const item of items) {
            const menuItem = await prisma.menuItem.findUnique({
                where: { id: item.menuItemId },
            });
            if (!menuItem) continue;

            let itemTotal = menuItem.price;
            if (item.selectedOptions) {
                for (const opt of item.selectedOptions) {
                    const optionId = typeof opt === 'string' ? opt : opt.optionItemId;
                    if (optionId) {
                        const dbOpt = await prisma.optionItem.findUnique({ where: { id: optionId } });
                        if (dbOpt) itemTotal += dbOpt.priceDelta;
                    }
                }
            }
            total += itemTotal * (item.quantity || 1);
        }

        // Apply tax
        total = Math.round(total * (1 + restaurant.taxRate) * 100) / 100;

        // Create order
        const order = await prisma.order.create({
            data: {
                orderNumber,
                status: 'RECEIVED',
                paymentMethod: body.paymentMethod || 'CARD',
                total,
                notes: notes || null,
                restaurantId: restaurant.id,
                tableId: table.id,
                items: {
                    create: items.map((item: any) => ({
                        quantity: item.quantity || 1,
                        unitPrice: item.unitPrice || 0,
                        notes: item.notes || null,
                        menuItemId: item.menuItemId,
                        options: {
                            create: (item.selectedOptions || []).map((opt: any) => {
                                const optionId = typeof opt === 'string' ? opt : opt.optionItemId;
                                return { optionItemId: optionId };
                            }).filter((o: any) => o.optionItemId),
                        },
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        menuItem: {
                            include: {
                                ingredients: true
                            }
                        },
                        options: {
                            include: {
                                optionItem: true,
                            },
                        },
                    },
                },
                table: true,
            },
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const restaurantSlug = searchParams.get('restaurantSlug');

    if (!restaurantSlug) {
        return NextResponse.json({ error: 'restaurantSlug required' }, { status: 400 });
    }

    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { slug: restaurantSlug },
        });
        if (!restaurant) {
            return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
        }

        const orders = await prisma.order.findMany({
            where: { restaurantId: restaurant.id },
            orderBy: { createdAt: 'desc' },
            include: {
                table: true,
                items: {
                    include: {
                        menuItem: {
                            include: {
                                allergens: {
                                    include: { allergen: true },
                                },
                            },
                        },
                        options: {
                            include: {
                                optionItem: {
                                    include: {
                                        optionGroup: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
