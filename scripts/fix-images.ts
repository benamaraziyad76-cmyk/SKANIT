// Script to fix image URLs in the database
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixImages() {
    console.log('🔧 Fixing image URLs in the database...\n');

    // Fix Tartare de Saumon - change .jpg to .png 
    const tartare = await prisma.menuItem.updateMany({
        where: { name: { contains: 'Tartare' }, image: { contains: '/images/tartare' } },
        data: { image: '/images/tartare.png' }
    });
    console.log(`✅ Tartare fixed: ${tartare.count} records`);

    // Fix Fondant au Chocolat - use tiramisu as placeholder until real image added
    const fondant = await prisma.menuItem.updateMany({
        where: { name: { contains: 'Fondant' }, image: { contains: '/images/fondant' } },
        data: { image: '/images/tiramisu.png' }
    });
    console.log(`✅ Fondant fixed: ${fondant.count} records`);

    // List all items with their images
    const restaurants = await prisma.restaurant.findFirst({ where: { slug: 'le-jardin' } });
    if (restaurants) {
        const categories = await prisma.category.findMany({
            where: { restaurantId: restaurants.id },
            include: { items: { select: { name: true, image: true, modelUrl: true } } }
        });
        console.log('\n📋 Current item images:');
        categories.forEach(cat => {
            cat.items.forEach(item => {
                console.log(`  ${item.name}: ${item.image || 'NO IMAGE'} | 3D: ${item.modelUrl ? '✅' : '❌'}`);
            });
        });
    }

    await prisma.$disconnect();
    console.log('\n✅ Done!');
}

fixImages().catch(console.error);
