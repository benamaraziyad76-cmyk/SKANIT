import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const MODELS = [
  {
    name: 'Pizza',
    glb: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Box/glTF-Binary/Box.glb', // Safest fallback
    usdz: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Box/glTF-Binary/Box.usdz',
    keywords: ['Pizza']
  },
  {
    name: 'Noodles',
    glb: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    usdz: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
    keywords: ['Ramen', 'Pâtes', 'Risotto', 'Velouté']
  },
  {
    name: 'Avocado',
    glb: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Avocado/glTF-Binary/Avocado.glb',
    usdz: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Avocado/glTF-Binary/Avocado.usdz',
    keywords: ['César', 'Salade']
  },
  {
    name: 'WaterBottle',
    glb: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/WaterBottle/glTF-Binary/WaterBottle.glb',
    usdz: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/WaterBottle/glTF-Binary/WaterBottle.usdz',
    keywords: ['Limonade', 'Boisson']
  },
  {
    name: 'Generic Dish',
    glb: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    usdz: null,
    keywords: ['Entrecôte', 'Saumon', 'Burger', 'Fondant', 'Tiramisu']
  }
];

async function main() {
  console.log('🔄 Attaching specific 3D DEMO models to all dishes...');

  const items = await prisma.menuItem.findMany();

  for (const item of items) {
    let selectedModel = MODELS.find(m => m.keywords.some(k => item.name.includes(k)));
    if (!selectedModel) selectedModel = MODELS[0]; // Fallback to pizza

    await prisma.menuItem.update({
      where: { id: item.id },
      data: {
        modelUrl: selectedModel.glb,
        iosModelUrl: selectedModel.usdz || selectedModel.glb.replace('.glb', '.usdz')
      }
    });

    console.log(`✅ ${item.name} -> Assigned mock model [${selectedModel.name}]`);
  }

  console.log('🎉 Tous les plats ont maitenant des modèles 3D différents !');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
