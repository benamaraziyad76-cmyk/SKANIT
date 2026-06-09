
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixPizzaModel() {
    console.log('🍕 Fixing Pizza model and adding reliable USDZ for iPhone...');

    // 1. Pizza specific
    await prisma.menuItem.updateMany({
        where: { name: { contains: 'Pizza' } },
        data: {
            modelUrl: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Pizza/glTF-Binary/Pizza.glb',
            iosModelUrl: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Pizza/glTF-Binary/Pizza.usdz'
        }
    });

    // 2. Others fallback to Noodles (known stable)
    await prisma.menuItem.updateMany({
        where: {
            NOT: { name: { contains: 'Pizza' } },
            modelUrl: { not: null }
        },
        data: {
            modelUrl: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Noodles/glTF-Binary/Noodles.glb',
            iosModelUrl: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Noodles/glTF-Binary/Noodles.usdz'
        }
    });

    console.log('✅ Models updated with reliable sources!');
    await prisma.$disconnect();
}

fixPizzaModel().catch(console.error);
