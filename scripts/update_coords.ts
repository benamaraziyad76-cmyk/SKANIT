import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("=== MISE À JOUR DES COORDONNÉES LA SCAMPIA ===");
  
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: 'la-scampia' }
  });

  if (!restaurant) {
    console.log("Restaurant non trouvé !");
    return;
  }

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: {
      address: "127 Rue Saint-Hilaire, 76000 Rouen",
      phone: "02 76 00 17 23",
      openingHours: "00:00", // Ferme à minuit
      description: "Restaurant à Rouen - Spécialités Burgers & Tacos",
      // Instagram URL dans un champ si dispo, sinon on peut l'ajouter dans la description
    }
  });

  console.log("✅ Coordonnées mises à jour avec succès !");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
