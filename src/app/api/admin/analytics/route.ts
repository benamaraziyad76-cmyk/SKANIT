import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('restaurantSlug') || 'le-jardin';

    const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
    if (!restaurant) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.order.findMany({
        where: { restaurantId: restaurant.id, createdAt: { gte: todayStart } },
        include: { items: { include: { menuItem: true } } }
    });

    const allOrders = await prisma.order.findMany({
        where: { restaurantId: restaurant.id },
        include: { items: { include: { menuItem: true } } }
    });

    const getStats = (orders: any[]) => {
        const revenue = orders.reduce((sum, o) => sum + o.total, 0);
        const orderCount = orders.length;
        const avgBasket = orderCount > 0 ? revenue / orderCount : 0;

        const dishCounts: Record<string, { name: string; count: number; revenue: number }> = {};
        const paymentCounts: Record<string, { method: string; total: number; count: number }> = {
            'CARD': { method: 'CARD', total: 0, count: 0 },
            'CASH': { method: 'CASH', total: 0, count: 0 }
        };

        for (const order of orders) {
            // Payments
            const pm = (order.paymentMethod || 'CARD') as 'CARD' | 'CASH';
            if (paymentCounts[pm]) {
                paymentCounts[pm].total += order.total;
                paymentCounts[pm].count += 1;
            }

            // Dishes
            for (const item of order.items) {
                const key = item.menuItemId;
                if (!dishCounts[key]) {
                    dishCounts[key] = { name: item.menuItem.name, count: 0, revenue: 0 };
                }
                dishCounts[key].count += item.quantity;
                dishCounts[key].revenue += item.unitPrice * item.quantity;
            }
        }

        const topDishes = Object.values(dishCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            revenue: Math.round(revenue * 100) / 100,
            orderCount,
            avgBasket: Math.round(avgBasket * 100) / 100,
            topDishes,
            payments: Object.values(paymentCounts)
        };
    };

    // Peak hours (today only)
    const hourCounts: Record<number, number> = {};
    for (const order of todayOrders) {
        const hour = new Date(order.createdAt).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
    const peakHours = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: hourCounts[i] || 0,
    }));

    return NextResponse.json({
        today: {
            ...getStats(todayOrders),
            peakHours
        },
        allTime: getStats(allOrders)
    });
}
