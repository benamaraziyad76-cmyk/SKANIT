import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("=== AJOUT DE LA CATEGORIE NOUVEAUTES ===");
  
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: 'la-scampia' }
  });

  if (!restaurant) {
    console.log("Restaurant non trouvé !");
    return;
  }

  // 1. Créer la catégorie Nouveautés si elle n'existe pas
  // On la met avec un sortOrder de 2 pour qu'elle soit "au milieu"
  let category = await prisma.category.findFirst({
    where: { 
      restaurantId: restaurant.id,
      name: 'Nouveautés'
    }
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Nouveautés',
        slug: 'nouveautes',
        icon: '✨',
        sortOrder: 2, // Milieu
        restaurantId: restaurant.id
      }
    });
    console.log("Catégorie 'Nouveautés' créée !");
  } else {
    await prisma.category.update({
      where: { id: category.id },
      data: { sortOrder: 2 }
    });
    console.log("Catégorie 'Nouveautés' mise à jour (milieu).");
  }

  // 2. Mettre à jour le restaurant avec les infos de promo
  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: {
      promoText: "NOUVEAUTÉS",
      promoImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80",
      promoCategoryId: category.id,
      promoPrice: 12.50 // Prix d'exemple
    }
  });

  console.log("✅ Promotion mise à jour avec texte 'NOUVEAUTÉS' !");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
