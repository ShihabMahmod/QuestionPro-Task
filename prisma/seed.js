const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminName = process.env.ADMIN_NAME || 'Super Admin';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  const sampleItems = [
    { name: 'Apple', price: 2.99, inventoryCount: 100 },
    { name: 'Banana', price: 1.49, inventoryCount: 150 },
    { name: 'Orange', price: 3.49, inventoryCount: 80 },
    { name: 'Milk', price: 4.99, inventoryCount: 50 },
    { name: 'Bread', price: 3.99, inventoryCount: 60 },
    { name: 'Eggs', price: 5.99, inventoryCount: 40 },
  ];

  for (const item of sampleItems) {
    const existingItem = await prisma.groceryItem.findFirst({
      where: { name: item.name },
    });

    if (!existingItem) {
      await prisma.groceryItem.create({
        data: item,
      });
      console.log(`Sample item created: ${item.name}`);
    }
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });