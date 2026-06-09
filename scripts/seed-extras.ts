import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const restaurant = await prisma.restaurant.findUnique({
        where: { slug: 'la-scampia' },
    });

    if (!restaurant) {
        console.error('Restaurant la-scampia not found');
        return;
    }

    // Add Desserts Category
    const dessertCat = await prisma.category.upsert({
        where: { restaurantId_slug: { restaurantId: restaurant.id, slug: 'desserts' } },
        update: { name: 'DESSERTS', icon: '🍰' },
        create: {
            name: 'DESSERTS',
            slug: 'desserts',
            icon: '🍰',
            restaurantId: restaurant.id,
            sortOrder: 2,
        },
    });

    // Add Drinks Category
    const drinkCat = await prisma.category.upsert({
        where: { restaurantId_slug: { restaurantId: restaurant.id, slug: 'boissons' } },
        update: { name: 'BOISSONS', icon: '🥤' },
        create: {
            name: 'BOISSONS',
            slug: 'boissons',
            icon: '🥤',
            restaurantId: restaurant.id,
            sortOrder: 3,
        },
    });

    // Add Tiramisu
    await prisma.menuItem.upsert({
        where: { id: 'tiramisu-id' },
        update: {},
        create: {
            id: 'tiramisu-id',
            name: 'Tiramisu Maison',
            description: 'Le classique italien au café et mascarpone.',
            price: 6.5,
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500',
            categoryId: dessertCat.id,
        },
    });

    // Add Panna Cotta
    await prisma.menuItem.upsert({
        where: { id: 'pannacotta-id' },
        update: {},
        create: {
            id: 'pannacotta-id',
            name: 'Panna Cotta Coco',
            description: 'Coulis de fruits rouges et éclats de coco.',
            price: 5.9,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500',
            categoryId: dessertCat.id,
        },
    });

    // Add Coca Cola
    await prisma.menuItem.upsert({
        where: { id: 'coca-id' },
        update: {},
        create: {
            id: 'coca-id',
            name: 'Coca Cola 33cl',
            description: 'Canette fraîche.',
            price: 2.5,
            image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500',
            categoryId: drinkCat.id,
        },
    });

    // Add Sprite
    await prisma.menuItem.upsert({
        where: { id: 'sprite-id' },
        update: {},
        create: {
            id: 'sprite-id',
            name: 'Sprite 33cl',
            description: 'Canette fraîche.',
            price: 2.5,
            image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=500',
            categoryId: drinkCat.id,
        },
    });

    console.log('Desserts and Drinks seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
