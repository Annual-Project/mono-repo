import prisma from '../../config/db.js';

async function main() {
  console.log('Seeding database...');

  // Création des magasins
  const stores = await prisma.store.createMany({
    data: [
      { name: 'Store A', description: 'Description for Store A' },
      { name: 'Store B', description: 'Description for Store B' },
      { name: 'Store C', description: 'Description for Store C' },
      { name: 'Store D', description: 'Description for Store D' },
      { name: 'Store E', description: 'Description for Store E' },
      { name: 'Store F', description: 'Description for Store F' },
      { name: 'Store G', description: 'Description for Store G' },
      { name: 'Store H', description: 'Description for Store H' },
      { name: 'Store I', description: 'Description for Store I' },
      { name: 'Store J', description: 'Description for Store J' },
    ],
  });

  console.log(`Inserted ${stores.count} stores.`);

  // Création des stocks
  const stocks = await prisma.stock.createMany({
    data: [
      { productId: 1, storeId: 1, quantityAvailable: 12, criticalThreshold: 5 },
      { productId: 1, storeId: 2, quantityAvailable: 8, criticalThreshold: 5 },
      { productId: 2, storeId: 1, quantityAvailable: 20, criticalThreshold: 10 },
      { productId: 3, storeId: 3, quantityAvailable: 5, criticalThreshold: 3 },
      { productId: 4, storeId: 4, quantityAvailable: 15, criticalThreshold: 7 },
      { productId: 5, storeId: 5, quantityAvailable: 10, criticalThreshold: 4 },
      { productId: 6, storeId: 6, quantityAvailable: 25, criticalThreshold: 10 },
      { productId: 7, storeId: 7, quantityAvailable: 30, criticalThreshold: 15 },
      { productId: 8, storeId: 8, quantityAvailable: 18, criticalThreshold: 8 },
      { productId: 9, storeId: 9, quantityAvailable: 22, criticalThreshold: 12 },
      { productId: 10, storeId: 10, quantityAvailable: 14, criticalThreshold: 6 },
    ],
  });

  console.log(`Inserted ${stocks.count} stocks.`);

}

main()
  .then(async () => {
    console.log('Seeding completed.');
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  });

