// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '../../generated/client.js';
const prisma = new PrismaClient();

// Insert sample products into the database
const seedProducts = async () => {
  const categories = [
    {
      name: 'Electronics',
      description: 'Devices and gadgets',
    },
    {
      name: 'Books',
      description: 'Literature and educational materials',
    },
  ];

  const products = [
    {
      name: 'Product 1',
      description: 'Description for product 1',
      price: 100.00,
      categoryId: 1,
    },
    {
      name: 'Product 2',
      description: 'Description for product 2',
      price: 150.00,
      categoryId: 2,
    },
    {
      name: 'Product 3',
      description: 'Description for product 3',
      price: 200.00,
      categoryId: 1,
    },
  ];

  // Create categories
  await prisma.category.createMany({
    data: categories,
  });

  // Create products
  await prisma.product.createMany({
    data: products,
  });

  console.log('Products seeded successfully');
}

// Execute the seeding function
const runSeed = async () => {
  try {
    console.log('Starting database seeding...');
    // await prisma.$connect();
    await seedProducts();
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    // await prisma.$disconnect();
    console.log('Database seeding completed');
  }
};
runSeed();
