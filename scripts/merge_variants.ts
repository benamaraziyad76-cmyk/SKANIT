import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("=== FUSION COMPLETE DES VARIANTES (SMASH & TACOS) ===");
  
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: 'la-scampia' }
  });

  if (!restaurant) {
    console.log("Restaurant non trouvé !");
    return;
  }

  // 1. CONFIGURATION SMASH BURGERS
  const smashCat = await prisma.category.findFirst({
    where: { restaurantId: restaurant.id, name: { contains: 'Smash' } }
  });

  if (smashCat) {
    console.log("Mise à jour des SMASH BURGERS...");
    
    // On nettoie d'abord les anciens items pour repartir propre
    await prisma.menuItem.deleteMany({ where: { categoryId: smashCat.id } });

    const mainSmash = await prisma.menuItem.create({
      data: {
        name: "NOTRE SMASH BURGER",
        description: "Le vrai Smash Burger, personnalisable à l'infini.",
        price: 8.50,
        image: "/menu-images/smash-double-s.jpg",
        categoryId: smashCat.id,
        sortOrder: -10
      }
    });

    const variantGroup = await prisma.optionGroup.create({
      data: { name: "CHOISISSEZ VOTRE SMASH", type: "radio", required: true, menuItemId: mainSmash.id, sortOrder: 1 }
    });

    // Liste explicite des Smash
    const burgers = [
      { name: "Le Double S", price: 8.50, isDefault: true },
      { name: "Le Smoke", price: 9.50 },
      { name: "Big Smash", price: 11.50 },
      { name: "Le Crispy", price: 9.50 },
      { name: "Le Country", price: 9.50 },
      { name: "Le S", price: 7.50 }
    ];

    for (const b of burgers) {
      await prisma.optionItem.create({
        data: { name: b.name, priceDelta: b.price - 8.50, isDefault: b.isDefault || false, optionGroupId: variantGroup.id }
      });
    }

    const suppGroup = await prisma.optionGroup.create({
      data: { name: "SUPPLÉMENTS", type: "checkbox", required: false, menuItemId: mainSmash.id, sortOrder: 2 }
    });
    await prisma.optionItem.create({ data: { name: "Fromage supplémentaire", priceDelta: 1.00, optionGroupId: suppGroup.id } });
    await prisma.optionItem.create({ data: { name: "Bacon", priceDelta: 1.50, optionGroupId: suppGroup.id } });
    await prisma.optionItem.create({ data: { name: "Steak supplémentaire", priceDelta: 2.50, optionGroupId: suppGroup.id } });
  }

  // 2. CONFIGURATION TACOS
  const tacosCat = await prisma.category.findFirst({
    where: { restaurantId: restaurant.id, name: { contains: 'Tacos' } }
  });

  if (tacosCat) {
    console.log("Mise à jour des TACOS...");
    await prisma.menuItem.deleteMany({ where: { categoryId: tacosCat.id } });

    const mainTacos = await prisma.menuItem.create({
      data: {
        name: "NOTRE TACOS",
        description: "Créez votre propre tacos : 1, 2 ou 3 viandes.",
        price: 7.00,
        image: "/menu-images/sandwich-kebab.jpg",
        categoryId: tacosCat.id,
        sortOrder: -10
      }
    });

    const sizeGroup = await prisma.optionGroup.create({
      data: { name: "NOMBRE DE VIANDES", type: "radio", required: true, menuItemId: mainTacos.id, sortOrder: 1 }
    });
    await prisma.optionItem.create({ data: { name: "Tacos 1 Viande", priceDelta: 0, optionGroupId: sizeGroup.id, isDefault: true } });
    await prisma.optionItem.create({ data: { name: "Tacos 2 Viandes", priceDelta: 2.00, optionGroupId: sizeGroup.id } });
    await prisma.optionItem.create({ data: { name: "Tacos 3 Viandes", priceDelta: 4.00, optionGroupId: sizeGroup.id } });

    const viandeGroup = await prisma.optionGroup.create({
      data: { name: "CHOIX DES VIANDES", type: "checkbox", required: true, menuItemId: mainTacos.id, sortOrder: 2 }
    });
    ["Poulet", "Viande Hachée", "Kebab", "Cordon Bleu", "Merguez"].forEach(v => {
      prisma.optionItem.create({ data: { name: v, priceDelta: 0, optionGroupId: viandeGroup.id } }).catch(()=>{});
    });

    const sauceGroup = await prisma.optionGroup.create({
      data: { name: "CHOIX DES SAUCES", type: "checkbox", required: true, menuItemId: mainTacos.id, sortOrder: 3 }
    });
    ["Algérienne", "Samouraï", "Mayonnaise", "Ketchup", "Fromagère Maison"].forEach(s => {
      prisma.optionItem.create({ data: { name: s, priceDelta: 0, optionGroupId: sauceGroup.id } }).catch(()=>{});
    });
  }

  console.log("✅ Menu Smash & Tacos mis à jour avec succès !");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
