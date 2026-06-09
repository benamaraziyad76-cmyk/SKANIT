
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const restaurant = await prisma.restaurant.findUnique({ where: { slug: 'le-jardin' } });
    if (!restaurant) return console.log('Restaurant not found');

    const burger = await prisma.menuItem.findFirst({ where: { name: { contains: 'Burger' } } });
    if (!burger) return console.log('Burger not found');

    // Create Ingredients
    const ingredients = [
        { name: 'Pain burger', unit: 'unit', stock: 50, minStock: 10 },
        { name: 'Steak Aubrac', unit: 'unit', stock: 40, minStock: 5 },
        { name: 'Fromage Cheddar', unit: 'tranche', stock: 100, minStock: 20 },
        { name: 'Sauce maison', unit: 'ml', stock: 2000, minStock: 500 },
    ];

    for (const ing of ingredients) {
        const createdIng = await prisma.ingredient.create({
            data: {
                ...ing,
                restaurantId: restaurant.id
            }
        });

        // Link to Burger
        await prisma.menuIngredient.create({
            data: {
                menuItemId: burger.id,
                ingredientId: createdIng.id,
                quantity: ing.name === 'Sauce maison' ? 30 : 1 // 1 unit/slice or 30ml
            }
        });
    }

    console.log('✅ Inventory seed completed!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
