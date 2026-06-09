const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Mise à jour des images de la base de données...");
    const items = await prisma.menuItem.findMany({ include: { category: true } });
    
    let updatedCount = 0;
    for (const item of items) {
        let newImage = null;
        const catName = item.category.name.toLowerCase();
        
        if (catName.includes('sandwich')) newImage = '/menu-images/sandwich-menu.jpg';
        else if (catName.includes('smash')) newImage = '/menu-images/smash-burger-menu.jpg';
        else if (catName.includes('naan burger')) newImage = '/menu-images/naan-burger-menu.jpg';
        else if (catName.includes('cheese naan')) newImage = '/menu-images/cheese-naan-menu.jpg';
        else if (catName.includes('plat')) newImage = '/menu-images/plats-menu.jpg';
        else if (catName.includes('tacos')) newImage = '/menu-images/tacos-generic.png';

        if (newImage && item.image !== newImage) {
            await prisma.menuItem.update({
                where: { id: item.id },
                data: { image: newImage }
            });
            updatedCount++;
        }
    }
    console.log(`${updatedCount} images mises à jour avec succès !`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
