import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Récupération du restaurant...');
  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) {
    console.error('Aucun restaurant trouvé !');
    return;
  }
  const restaurantId = restaurant.id;

  console.log('Recherche des catégories Boissons et Desserts...');
  const catBoissons = await prisma.category.findFirst({ where: { restaurantId, slug: 'boissons' } });
  const catDesserts = await prisma.category.findFirst({ where: { restaurantId, slug: 'desserts' } });

  if (catBoissons) {
    console.log('Ajout des boissons...');
    const boissonsToAdd = [
      { name: 'Coca', price: 2.50 },
      { name: 'Coca cherry', price: 2.50 },
      { name: 'Fanta orange', price: 2.50 },
      { name: 'Fanta citron', price: 2.50 },
      { name: 'Fanta fraise kiwi', price: 2.50 },
      { name: 'Fanta vert', price: 2.50 },
      { name: 'Hawaï', price: 2.50 },
      { name: 'Schweppes pomme', price: 2.50 },
      { name: 'Lipton ice tea', price: 2.50 },
      { name: 'Eau', price: 1.50 },
      { name: 'Perrier', price: 2.00 },
      { name: 'Oasis tropical', price: 2.50 },
      { name: 'Oasis fraise framboise', price: 2.50 },
      { name: 'Oasis pomme poire', price: 2.50 },
    ];

    for (const b of boissonsToAdd) {
      const exists = await prisma.menuItem.findFirst({
        where: { categoryId: catBoissons.id, name: b.name }
      });
      if (!exists) {
        await prisma.menuItem.create({
          data: {
            name: b.name,
            description: '',
            price: b.price,
            categoryId: catBoissons.id,
            image: '', // Sans photo
            isAvailable: true
          }
        });
        console.log(`+ Boisson ajoutée: ${b.name}`);
      } else {
        console.log(`= Boisson déjà existante: ${b.name}`);
      }
    }
  }

  if (catDesserts) {
    console.log('\nAjout des desserts...');
    const dessertsToAdd = [
      { name: 'Tiramisu pistache', price: 4.50 },
      { name: 'Tiramisu Caramel spéculos', price: 4.50 },
    ];

    for (const d of dessertsToAdd) {
      const exists = await prisma.menuItem.findFirst({
        where: { categoryId: catDesserts.id, name: d.name }
      });
      if (!exists) {
        await prisma.menuItem.create({
          data: {
            name: d.name,
            description: '',
            price: d.price,
            categoryId: catDesserts.id,
            image: '', // Sans photo
            isAvailable: true
          }
        });
        console.log(`+ Dessert ajouté: ${d.name}`);
      } else {
        console.log(`= Dessert déjà existant: ${d.name}`);
      }
    }
  }

  console.log('\nMise à jour des sauces...');
  const sauceGroups = await prisma.optionGroup.findMany({
    where: { name: 'Sauce' },
    include: { options: true }
  });

  const saucesToAdd = ['Andalouse', 'Samouraï'];
  for (const group of sauceGroups) {
    for (const sauceName of saucesToAdd) {
      const exists = group.options.find(o => o.name === sauceName);
      if (!exists) {
        await prisma.optionItem.create({
          data: {
            name: sauceName,
            priceDelta: 0,
            optionGroupId: group.id,
            sortOrder: group.options.length + 1
          }
        });
        console.log(`+ Sauce ${sauceName} ajoutée au groupe de l'article ${group.menuItemId}`);
      }
    }
  }

  console.log('\nMise à jour des suppléments...');
  const suppGroups = await prisma.optionGroup.findMany({
    where: { name: 'Suppléments' },
    include: { options: true }
  });

  const suppsToAdd = [
    { name: 'Cheddar', price: 1.00 },
    { name: 'Chèvre', price: 1.00 },
    { name: 'Lardon', price: 1.00 },
    // Bacon is usually already there, but we can verify
    { name: 'Bacon', price: 1.00 },
  ];

  for (const group of suppGroups) {
    for (const supp of suppsToAdd) {
      const exists = group.options.find(o => o.name.toLowerCase() === supp.name.toLowerCase());
      if (!exists) {
        await prisma.optionItem.create({
          data: {
            name: supp.name,
            priceDelta: supp.price,
            optionGroupId: group.id,
            sortOrder: group.options.length + 1
          }
        });
        console.log(`+ Supplément ${supp.name} ajouté au groupe de l'article ${group.menuItemId}`);
      }
    }
  }

  console.log('\n✅ Terminé avec succès !');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
