
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const HIGH_QUALITY_IMAGES: Record<string, string> = {
    'Salade César': 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=1200',
    'Velouté de Champignons': 'https://images.unsplash.com/photo-1547592115-0dec33011b66?q=80&w=1200',
    'Tartare de Saumon': 'https://images.unsplash.com/photo-1534083264897-aeabfc7daf8a?q=80&w=1200',
    'Entrecôte Grillée': 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1200',
    'Risotto aux Cèpes': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1200',
    'Saumon Laqué Miso': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1200',
    'Burger Le Jardin': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200',
    'Tiramisu Classique': 'https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=1200',
    'Fondant au Chocolat': 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1200',
    'Limonade Artisanale': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200'
};

async function updateAllImages() {
    console.log('🖼️ Updating all menu item images to high quality...');

    for (const [name, url] of Object.entries(HIGH_QUALITY_IMAGES)) {
        await prisma.menuItem.updateMany({
            where: { name: { contains: name } },
            data: { image: url }
        });
        console.log(`✅ ${name} updated.`);
    }

    // Also ensure everyone has a modelUrl for testing
    await prisma.menuItem.updateMany({
        where: { modelUrl: null },
        data: {
            modelUrl: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Noodles/glTF-Binary/Noodles.glb',
            iosModelUrl: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Noodles/glTF-Binary/Noodles.usdz'
        }
    });

    console.log('\n✨ Database polished!');
    await prisma.$disconnect();
}

updateAllImages().catch(console.error);
