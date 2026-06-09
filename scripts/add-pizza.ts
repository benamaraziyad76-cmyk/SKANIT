
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const cat = await prisma.category.findFirst({ where: { name: 'Plats' } });
    if (cat) {
        const item = await prisma.menuItem.create({
            data: {
                name: 'Pizza Margherita',
                description: 'Sauce tomate bio, mozzarella di bufala, basilic frais, huile d\'olive',
                price: 15.0,
                image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1200',
                modelUrl: '/models/pizza.glb',
                iosModelUrl: '/models/pizza.glb', // Fallback for now
                categoryId: cat.id,
                tags: '["best-seller", "veggie"]'
            }
        });
        console.log('✅ Pizza added with ID:', item.id);
    } else {
        console.log('❌ Category "Plats" not found.');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
