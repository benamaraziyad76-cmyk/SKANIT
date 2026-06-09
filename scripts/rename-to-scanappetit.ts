
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    await prisma.restaurant.updateMany({
        where: { slug: 'le-jardin' },
        data: { name: 'ScanAppetit' }
    });
    console.log('Restaurant renamed to ScanAppetit');
}
main().catch(console.error).finally(() => prisma.$disconnect());
