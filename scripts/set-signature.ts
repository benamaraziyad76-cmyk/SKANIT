
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function setSignature() {
  console.log('🍕 Setting Pizza Margherita as the Signature dish for Zero Latency testing...');
  
  // Remove signature from others
  await prisma.menuItem.updateMany({
    data: { isSignature: false }
  });

  // Set Pizza as signature
  await prisma.menuItem.updateMany({
    where: { name: 'Pizza Margherita' },
    data: { isSignature: true }
  });

  console.log('✅ Pizza Margherita is now the Signature dish!');
  await prisma.$disconnect();
}

setSignature().catch(console.error);
