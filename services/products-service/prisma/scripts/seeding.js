import prisma from '../../config/db.js';

// Insert sample products into the database
async function main() {
  const categories = [
    { name: 'Electronics', description: 'Devices and gadgets' },
    { name: 'Books', description: 'Literature and educational materials' },
    { name: 'Clothing', description: 'Apparel and accessories' },
    { name: 'Home Appliances', description: 'Appliances for home use' },
    { name: 'Toys', description: 'Toys and games for kids' },
    { name: 'Sports', description: 'Sports equipment and gear' },
  ];

  const products = [
    { name: 'Smartphone', description: 'Latest model smartphone', price: 699.99, categoryId: 1 },
    { name: 'Fiction Book', description: 'A thrilling fiction novel', price: 19.99, categoryId: 2 },
    { name: 'Laptop', description: 'High-performance laptop', price: 1299.99, categoryId: 1 },
    { name: 'Cookbook', description: 'Recipes for every occasion', price: 24.99, categoryId: 2 },
    { name: 'T-shirt', description: 'Comfortable cotton t-shirt', price: 14.99, categoryId: 3 },
    { name: 'Jeans', description: 'Stylish denim jeans', price: 49.99, categoryId: 3 },
    { name: 'Vacuum Cleaner', description: 'Powerful vacuum cleaner', price: 199.99, categoryId: 4 },
    { name: 'Blender', description: 'Multi-purpose kitchen blender', price: 89.99, categoryId: 4 },
    { name: 'Action Figure', description: 'Collectible action figure', price: 29.99, categoryId: 5 },
    { name: 'Basketball', description: 'Official size basketball', price: 39.99, categoryId: 6 },
  ];

  // Create categories
  await prisma.category.createMany({
    data: categories,
  });

  console.log('Categories seeded successfully');

  // Create products
  await prisma.product.createMany({
    data: products,
  });

  console.log('Products seeded successfully');
}

// Execute the seeding function
main()
  .then(async () => {
    console.log('Seeding completed.');
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  });