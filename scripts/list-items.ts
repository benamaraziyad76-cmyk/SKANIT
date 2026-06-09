import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const items = await prisma.menuItem.findMany({
        select: { name: true, image: true, modelUrl: true }
    });
    console.log(JSON.stringify(items, null, 2));
}
main().finally(() => prisma.$disconnect());
