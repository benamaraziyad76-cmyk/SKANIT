import { PrismaClient } from '@prisma/client';

export async function seedScampiaMenu(prisma: PrismaClient, restaurantId: string) {

  // ── CATEGORIES ──────────────────────────────────────────────────────────────
  const catSandwich    = await prisma.category.create({ data: { name: 'Sandwich',     slug: 'sandwich',     icon: '🥪', sortOrder: 1, restaurantId } });
  const catSmash       = await prisma.category.create({ data: { name: 'Smash Burger', slug: 'smash-burger', icon: '🍔', sortOrder: 2, restaurantId } });
  const catNaan        = await prisma.category.create({ data: { name: 'Cheese Naan',  slug: 'cheese-naan',  icon: '🧀', sortOrder: 3, restaurantId } });
  const catNaanBurger  = await prisma.category.create({ data: { name: 'Naan Burger',  slug: 'naan-burger',  icon: '🍔', sortOrder: 4, restaurantId } });
  const catPlat        = await prisma.category.create({ data: { name: 'Plat Cuisiné', slug: 'plat-cuisine', icon: '🍽️', sortOrder: 5, restaurantId } });
  const catTacos       = await prisma.category.create({ data: { name: 'Tacos',        slug: 'tacos',        icon: '🌮', sortOrder: 6, restaurantId } });
  const catBoissons    = await prisma.category.create({ data: { name: 'Boissons',     slug: 'boissons',     icon: '🥤', sortOrder: 7, restaurantId } });
  const catDesserts    = await prisma.category.create({ data: { name: 'Desserts',     slug: 'desserts',     icon: '🍰', sortOrder: 8, restaurantId } });

  // ══════════════════════════════════════════════════════════════════════════════
  // SANDWICH — Prix exacts carte : Seul / Menu (+1€)
  // ══════════════════════════════════════════════════════════════════════════════
  const sandwichItems = [
    { name: 'Américain',      description: '2 steaks, crudités, cheddar',              price: 7.50, img: '/menu-images/sandwich-americain.jpg' },
    { name: 'Chicken',        description: 'Tandoori ou curry ou nature',               price: 7.50, img: '/menu-images/sandwich-chicken.jpg' },
    { name: 'Kebab',          description: 'Kebab, crudités, cheddar',                  price: 7.50, img: '/menu-images/sandwich-kebab.jpg' },
    { name: 'Royal',          description: '2 viandes aux choix, crudités',             price: 8.50, img: '/menu-images/sandwich-royal.jpg' },
    { name: 'Spécial',        description: '2 steaks, oeuf, bacon',                     price: 8.50, img: '/menu-images/sandwich-special.jpg' },
    { name: 'Boursin',        description: 'Chicken ou steak, crème boursin, crudités', price: 8.00, img: '/menu-images/sandwich-boursin.jpg' },
  ];
  const createdSandwich = [];
  for (const s of sandwichItems) {
    createdSandwich.push(await prisma.menuItem.create({ data: { name: s.name, description: s.description, price: s.price, categoryId: catSandwich.id, image: s.img, isAvailable: true } }));
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // SMASH BURGER — Prix carte : Le Double S/S/Crispy/Smoke = 8.50€, Big Smash/Country = 9.50€
  // ══════════════════════════════════════════════════════════════════════════════
  const smashItems = [
    { name: 'Le Double S', description: 'Double steaks smashés, crudités',        price: 8.50, sig: true,  img: '/menu-images/smash-double-s.jpg' },
    { name: 'Le S',        description: 'Steak smashé, crudités',                 price: 8.50, sig: false, img: '/menu-images/smash-le-s.jpg' },
    { name: 'Le Crispy',   description: 'Viande smashée, oignon frits',           price: 8.50, sig: false, img: '/menu-images/smash-crispy.jpg' },
    { name: 'Le Smoke',    description: 'Steak smashé, bacon',                    price: 8.50, sig: false, img: '/menu-images/smash-smoke.jpg' },
    { name: 'Big Smash',   description: 'Classique 3 steaks smashés',             price: 9.50, sig: false, img: '/menu-images/smash-big-smah.jpg' },
    { name: 'Le Country',  description: '2 steaks smashés, galette de pdt',       price: 9.50, sig: false, img: '/menu-images/smash-contry.jpg' },
  ];
  const createdSmash = [];
  for (const s of smashItems) {
    createdSmash.push(await prisma.menuItem.create({ data: { name: s.name, description: s.description, price: s.price, isSignature: s.sig, categoryId: catSmash.id, image: s.img, isAvailable: true } }));
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // CHEESE NAAN — Prix carte : Radical/Royal/Boursin/Spécial/Montagnard/Phénomène = 9.50€ ; reste = 8.50€
  // ══════════════════════════════════════════════════════════════════════════════
  const naanItems = [
    { name: 'Naan Radical',      description: 'Steak, cordon bleu, oeuf',                 price: 9.50, sig: true,  img: '/menu-images/naan-radical.jpg' },
    { name: 'Naan Royal',        description: '2 viandes aux choix',                       price: 9.50, sig: false, img: '/menu-images/naan-royal.jpg' },
    { name: 'Naan Boursin',      description: 'Steak, blanc de poulet, boursin',           price: 9.50, sig: false, img: '/menu-images/naan-boursin.jpg' },
    { name: 'Naan Tenders',      description: 'Tenders croustillants',                     price: 8.50, sig: false, img: '/menu-images/naan-tenders.jpg' },
    { name: 'Naan Steak',        description: '3 steaks, cheddar, crudités',               price: 8.50, sig: false, img: '/menu-images/naan-steak.jpg' },
    { name: 'Naan Kebab',        description: 'Kebab, crudités',                           price: 8.50, sig: false, img: '/menu-images/naan-kebab.jpg' },
    { name: 'Naan Tandori',      description: 'Poulet tandoori',                           price: 8.50, sig: false, img: '/menu-images/naan-tandori.jpg' },
    { name: 'Naan Poulet Curry', description: 'Poulet curry',                              price: 8.50, sig: false, img: '/menu-images/naan-poulet-curry.jpg' },
    { name: 'Naan Chicken',      description: 'Poulet, crudité, cheddar',                  price: 8.50, sig: false, img: '/menu-images/naan-chicken.jpg' },
    { name: 'Naan Veggie',       description: 'Galette, pomme de terre, crudité, oeuf',    price: 8.50, sig: false, img: '/menu-images/naan-veggie.jpg' },
    { name: 'Naan Spécial',      description: 'Steak, bacon, oeuf',                        price: 9.50, sig: false, img: '/menu-images/naan-special.jpg' },
    { name: 'Naan Montagnard',   description: 'Steak, blanc de poulet, chèvre',            price: 9.50, sig: false, img: '/menu-images/naan-montagnard.jpg' },
    { name: 'Naan Phénomène',    description: 'Steak 90g, poulet pané',                    price: 9.50, sig: false, img: '/menu-images/naan-phenomene.jpg' },
  ];
  const createdNaan = [];
  for (const n of naanItems) {
    createdNaan.push(await prisma.menuItem.create({ data: { name: n.name, description: n.description, price: n.price, isSignature: n.sig, categoryId: catNaan.id, image: n.img, isAvailable: true } }));
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // NAAN BURGER — Tous à 9.90€ (Menu 10.90€)
  // Descriptions exactes de la carte
  // ══════════════════════════════════════════════════════════════════════════════
  const naanBurgerItems = [
    { name: "Big Naan",       description: '2 steaks 90g, cheddar, salade, cornichon, sauce biggy',       sig: true,  img: '/menu-images/naanburger-big-naan.jpg' },
    { name: "Cow Boy",        description: 'Steaks 90g, galette de pdt, crudités',                        sig: false, img: '/menu-images/naanburger-cowboy.jpg' },
    { name: "Crispy Chick'n", description: 'Poulet pané, galette de pommes de terre, cheddar, mayo spicy', sig: false, img: '/menu-images/naanburger-crispy-chickn.jpg' },
    { name: "Chèvre Miel",    description: 'Steak 90g, chèvre, miel',                                    sig: false, img: '/menu-images/naanburger-chevre-miel.jpg' },
    { name: "Le Smashé",      description: '3 steaks smashés, crudités',                                  sig: false, img: '/menu-images/naanburger-le-smashe.jpg' },
    { name: "Boursin Naan",   description: '2 steaks 90g, cheddar, boursin',                              sig: false, img: '/menu-images/naanburger-boursin.jpg' },
  ];
  const createdNaanBurger = [];
  for (const n of naanBurgerItems) {
    createdNaanBurger.push(await prisma.menuItem.create({ data: { name: n.name, description: n.description, price: 9.90, isSignature: n.sig, categoryId: catNaanBurger.id, image: n.img, isAvailable: true } }));
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PLATS CUISINÉS — Tous 9.90€ sauf Entrecôte 13.90€
  // ══════════════════════════════════════════════════════════════════════════════
  const platItems = [
    { name: 'Escalope Milanaise',      description: 'Escalope panée à la milanaise', price: 9.90,  sig: false, img: '/menu-images/plat-escalope-milanaise.jpg' },
    { name: 'Steak à Cheval',          description: 'Steak avec oeuf à cheval',       price: 9.90,  sig: false, img: '/menu-images/plat-steak-cheval.jpg' },
    { name: 'Filet de Poulet Normand', description: 'Filet de poulet sauce normande', price: 9.90,  sig: false, img: '/menu-images/plat-poulet-normand.jpg' },
    { name: 'Entrecôte',               description: 'Entrecôte grillée',              price: 13.90, sig: true,  img: '/menu-images/plat-entrecote.jpg' },
    { name: 'Escalope Gratinée',       description: 'Escalope gratinée au fromage',   price: 9.90,  sig: false, img: '/menu-images/plat-escalope-gratinee.jpg' },
    { name: 'Lasagne',                 description: 'Lasagne maison',                 price: 9.90,  sig: false, img: '/menu-images/plat-lasagne.jpg' },
  ];
  const createdPlat = [];
  for (const p of platItems) {
    createdPlat.push(await prisma.menuItem.create({ data: { name: p.name, description: p.description, price: p.price, isSignature: p.sig, categoryId: catPlat.id, image: p.img, isAvailable: true } }));
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // TACOS
  // ══════════════════════════════════════════════════════════════════════════════
  const tacosImg = 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80'; // Beautiful tacos image
  const tacosItems = [
    await prisma.menuItem.create({ data: { name: 'Tacos 1 Viande',  description: 'Tacos avec 1 viande au choix',  price: 7.50, categoryId: catTacos.id, image: tacosImg, isAvailable: true } }),
    await prisma.menuItem.create({ data: { name: 'Tacos 2 Viandes', description: 'Tacos avec 2 viandes au choix', price: 8.50, categoryId: catTacos.id, image: tacosImg, isAvailable: true } }),
    await prisma.menuItem.create({ data: { name: 'Tacos 3 Viandes', description: 'Tacos avec 3 viandes au choix', price: 9.50, categoryId: catTacos.id, image: tacosImg, isAvailable: true, isSignature: true } }),
  ];

  // ══════════════════════════════════════════════════════════════════════════════
  // BOISSONS
  // ══════════════════════════════════════════════════════════════════════════════
  await prisma.menuItem.create({ data: { name: 'Coca-Cola 33cl',   description: 'Coca-Cola classique',    price: 2.50, categoryId: catBoissons.id, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80', isAvailable: true } });
  await prisma.menuItem.create({ data: { name: 'Eau Minérale',     description: 'Eau plate ou gazeuse',   price: 1.50, categoryId: catBoissons.id, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80', isAvailable: true } });
  await prisma.menuItem.create({ data: { name: 'Orangina 33cl',    description: 'Orangina',               price: 2.50, categoryId: catBoissons.id, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=600&q=80', isAvailable: true } });
  await prisma.menuItem.create({ data: { name: 'Ice Tea 33cl',     description: 'Thé glacé pêche',        price: 2.50, categoryId: catBoissons.id, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80', isAvailable: true } });
  await prisma.menuItem.create({ data: { name: 'Jus de Fruit 33cl',description: 'Jus orange ou pomme',   price: 2.50, categoryId: catBoissons.id, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80', isAvailable: true } });

  // ══════════════════════════════════════════════════════════════════════════════
  // DESSERTS
  // ══════════════════════════════════════════════════════════════════════════════
  await prisma.menuItem.create({ data: { name: 'Tiramisu',          description: 'Tiramisu maison',        price: 4.50, categoryId: catDesserts.id, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80', isAvailable: true } });
  await prisma.menuItem.create({ data: { name: 'Mousse Chocolat',   description: 'Mousse au chocolat noir',price: 4.00, categoryId: catDesserts.id, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80', isAvailable: true } });

  // ══════════════════════════════════════════════════════════════════════════════
  // OPTIONS: Formule Menu (+1€) → Sandwich, Smash, Naan, NaanBurger, Tacos, Plats
  // ══════════════════════════════════════════════════════════════════════════════
  const allMainItems = [...createdSandwich, ...createdSmash, ...createdNaan, ...createdNaanBurger, ...tacosItems, ...createdPlat];
  for (const item of allMainItems) {
    await prisma.optionGroup.create({ data: {
      name: 'Formule',
      type: 'radio',
      required: false,
      menuItemId: item.id,
      sortOrder: 0,
      options: { create: [
        { name: 'Seul',   priceDelta: 0.00, isDefault: true, sortOrder: 1 },
        { name: 'Menu (frites + boisson)', priceDelta: 1.00, sortOrder: 2 },
      ]}
    }});
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // OPTIONS: Choix de viande → Sandwich (wraps + chicken + royal), Tacos
  // ══════════════════════════════════════════════════════════════════════════════
  const itemsWithMeatChoice = [
    createdSandwich[1], // Chicken
    createdSandwich[3], // Royal
    ...tacosItems
  ];
  for (const item of itemsWithMeatChoice) {
    await prisma.optionGroup.create({ data: {
      name: 'Viande(s)',
      type: 'checkbox',
      required: false,
      menuItemId: item.id,
      sortOrder: 1,
      options: { create: [
        { name: 'Poulet',       priceDelta: 0, sortOrder: 1 },
        { name: 'Steak haché',  priceDelta: 0, sortOrder: 2 },
        { name: 'Tenders',      priceDelta: 0, sortOrder: 3 },
        { name: 'Kebab',        priceDelta: 0, sortOrder: 4 },
        { name: 'Cordon bleu',  priceDelta: 0, sortOrder: 5 },
      ]}
    }});
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // OPTIONS: Sauces → Sandwich, Smash, NaanBurger, Tacos
  // ══════════════════════════════════════════════════════════════════════════════
  for (const item of [...createdSandwich, ...createdSmash, ...createdNaanBurger, ...tacosItems]) {
    await prisma.optionGroup.create({ data: {
      name: 'Sauce',
      type: 'checkbox',
      required: false,
      menuItemId: item.id,
      sortOrder: 2,
      options: { create: [
        { name: 'Algérienne', priceDelta: 0, sortOrder: 1 },
        { name: 'Biggy',      priceDelta: 0, sortOrder: 2 },
        { name: 'Barbecue',   priceDelta: 0, sortOrder: 3 },
        { name: 'Blanche',    priceDelta: 0, sortOrder: 4 },
        { name: 'Ketchup',    priceDelta: 0, sortOrder: 5 },
        { name: 'Mayo',       priceDelta: 0, sortOrder: 6 },
      ]}
    }});
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // OPTIONS: Suppléments → Sandwich, Smash, NaanBurger, Tacos
  // ══════════════════════════════════════════════════════════════════════════════
  for (const item of [...createdSandwich, ...createdSmash, ...createdNaanBurger, ...tacosItems]) {
    await prisma.optionGroup.create({ data: {
      name: 'Suppléments',
      type: 'checkbox',
      required: false,
      menuItemId: item.id,
      sortOrder: 3,
      options: { create: [
        { name: 'Fromage',    priceDelta: 1.00, sortOrder: 1 },
        { name: 'Oeuf',       priceDelta: 0.50, sortOrder: 2 },
        { name: 'Bacon',      priceDelta: 1.00, sortOrder: 3 },
        { name: 'Avocat',     priceDelta: 1.50, sortOrder: 4 },
      ]}
    }});
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // OPTIONS: Retirer ingrédients → Sandwich, Smash, NaanBurger
  // ══════════════════════════════════════════════════════════════════════════════
  for (const item of [...createdSandwich, ...createdSmash, ...createdNaanBurger]) {
    await prisma.optionGroup.create({ data: {
      name: 'Retirer',
      type: 'checkbox',
      required: false,
      menuItemId: item.id,
      sortOrder: 4,
      options: { create: [
        { name: 'Sans salade',  priceDelta: 0, sortOrder: 1 },
        { name: 'Sans tomate',  priceDelta: 0, sortOrder: 2 },
        { name: 'Sans oignon',  priceDelta: 0, sortOrder: 3 },
        { name: 'Sans sauce',   priceDelta: 0, sortOrder: 4 },
      ]}
    }});
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // OPTIONS: Cheese Naan → Sauces + Retirer
  // ══════════════════════════════════════════════════════════════════════════════
  for (const item of createdNaan) {
    await prisma.optionGroup.create({ data: {
      name: 'Sauce',
      type: 'checkbox',
      required: false,
      menuItemId: item.id,
      sortOrder: 1,
      options: { create: [
        { name: 'Algérienne', priceDelta: 0, sortOrder: 1 },
        { name: 'Blanche',    priceDelta: 0, sortOrder: 2 },
        { name: 'Biggy',      priceDelta: 0, sortOrder: 3 },
        { name: 'Harissa',    priceDelta: 0, sortOrder: 4 },
      ]}
    }});
    await prisma.optionGroup.create({ data: {
      name: 'Retirer',
      type: 'checkbox',
      required: false,
      menuItemId: item.id,
      sortOrder: 2,
      options: { create: [
        { name: 'Sans salade', priceDelta: 0, sortOrder: 1 },
        { name: 'Sans tomate', priceDelta: 0, sortOrder: 2 },
        { name: 'Sans oignon', priceDelta: 0, sortOrder: 3 },
      ]}
    }});
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // OPTIONS: Plats cuisinés → Accompagnement
  // Exactement comme sur la carte : Frites, Purée, Haricots verts, Pâtes à la crème, Gratin dauphinois
  // ══════════════════════════════════════════════════════════════════════════════
  for (const item of createdPlat) {
    await prisma.optionGroup.create({ data: {
      name: 'Accompagnement',
      type: 'radio',
      required: true,
      menuItemId: item.id,
      sortOrder: 1,
      options: { create: [
        { name: 'Frites',            priceDelta: 0, isDefault: true, sortOrder: 1 },
        { name: 'Purée',             priceDelta: 0, sortOrder: 2 },
        { name: 'Haricots verts',    priceDelta: 0, sortOrder: 3 },
        { name: 'Pâtes à la crème', priceDelta: 0, sortOrder: 4 },
        { name: 'Gratin dauphinois', priceDelta: 0, sortOrder: 5 },
      ]}
    }});
  }

  console.log('  ✅ Menu La Scampia créé — descriptions et prix exacts de la carte.');
}
