import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const nickFury = await prisma.user.create({
    data: {
      email: 'nick.fury@slooze.com',
      password: hashedPassword,
      name: 'Nick Fury',
      role: 'ADMIN',
    },
  });

  const captainMarvel = await prisma.user.create({
    data: {
      email: 'captain.marvel@slooze.com',
      password: hashedPassword,
      name: 'Captain Marvel',
      role: 'MANAGER',
      country: 'INDIA',
    },
  });

  const captainAmerica = await prisma.user.create({
    data: {
      email: 'captain.america@slooze.com',
      password: hashedPassword,
      name: 'Captain America',
      role: 'MANAGER',
      country: 'AMERICA',
    },
  });

  const thanos = await prisma.user.create({
    data: {
      email: 'thanos@slooze.com',
      password: hashedPassword,
      name: 'Thanos',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  const thor = await prisma.user.create({
    data: {
      email: 'thor@slooze.com',
      password: hashedPassword,
      name: 'Thor',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  const travis = await prisma.user.create({
    data: {
      email: 'travis@slooze.com',
      password: hashedPassword,
      name: 'Travis',
      role: 'MEMBER',
      country: 'AMERICA',
    },
  });

  console.log('✅ Users created');

  // Create restaurants for India
  const indianRestaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Taj Mahal Restaurant',
      description: 'Authentic Indian cuisine',
      country: 'INDIA',
      address: '123 Mumbai Street, Mumbai',
      phone: '+91-1234567890',
    },
  });

  const indianRestaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Spice Garden',
      description: 'Traditional North Indian food',
      country: 'INDIA',
      address: '456 Delhi Avenue, New Delhi',
      phone: '+91-9876543210',
    },
  });

  // Create restaurants for America
  const americanRestaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Burger Palace',
      description: 'Classic American burgers and fries',
      country: 'AMERICA',
      address: '789 Broadway, New York',
      phone: '+1-555-123-4567',
    },
  });

  const americanRestaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Pizza Express',
      description: 'New York style pizza',
      country: 'AMERICA',
      address: '321 Main Street, Los Angeles',
      phone: '+1-555-987-6543',
    },
  });

  console.log('✅ Restaurants created');

  // Create menu items for Indian restaurants
  const tajMahalItems = [
    { name: 'Butter Chicken', description: 'Creamy tomato-based curry', price: 450 },
    { name: 'Biryani', description: 'Fragrant basmati rice with spices', price: 350 },
    { name: 'Naan', description: 'Traditional Indian bread', price: 50 },
    { name: 'Samosas', description: 'Fried pastry with spiced filling', price: 80 },
    { name: 'Mango Lassi', description: 'Sweet yogurt drink', price: 100 },
  ];

  for (const item of tajMahalItems) {
    await prisma.menuItem.create({
      data: {
        ...item,
        restaurantId: indianRestaurant1.id,
      },
    });
  }

  const spiceGardenItems = [
    { name: 'Paneer Tikka', description: 'Grilled cottage cheese', price: 300 },
    { name: 'Dal Makhani', description: 'Creamy black lentils', price: 250 },
    { name: 'Roti', description: 'Whole wheat flatbread', price: 30 },
    { name: 'Gulab Jamun', description: 'Sweet milk dumplings', price: 120 },
  ];

  for (const item of spiceGardenItems) {
    await prisma.menuItem.create({
      data: {
        ...item,
        restaurantId: indianRestaurant2.id,
      },
    });
  }

  // Create menu items for American restaurants
  const burgerPalaceItems = [
    { name: 'Classic Burger', description: 'Beef patty with lettuce and tomato', price: 12.99 },
    { name: 'Cheeseburger', description: 'Burger with cheese', price: 13.99 },
    { name: 'French Fries', description: 'Crispy golden fries', price: 4.99 },
    { name: 'Onion Rings', description: 'Battered and fried onions', price: 5.99 },
    { name: 'Milkshake', description: 'Vanilla milkshake', price: 6.99 },
  ];

  for (const item of burgerPalaceItems) {
    await prisma.menuItem.create({
      data: {
        ...item,
        restaurantId: americanRestaurant1.id,
      },
    });
  }

  const pizzaExpressItems = [
    { name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 15.99 },
    { name: 'Pepperoni Pizza', description: 'Classic pepperoni', price: 17.99 },
    { name: 'Hawaiian Pizza', description: 'Ham and pineapple', price: 18.99 },
    { name: 'Caesar Salad', description: 'Fresh romaine with caesar dressing', price: 9.99 },
    { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 6.99 },
  ];

  for (const item of pizzaExpressItems) {
    await prisma.menuItem.create({
      data: {
        ...item,
        restaurantId: americanRestaurant2.id,
      },
    });
  }

  console.log('✅ Menu items created');

  // Create payment methods for Nick Fury (Admin)
  await prisma.paymentMethod.create({
    data: {
      userId: nickFury.id,
      type: 'credit_card',
      cardNumber: '****1234',
      cardHolder: 'Nick Fury',
      expiryDate: '12/25',
      isDefault: true,
    },
  });

  await prisma.paymentMethod.create({
    data: {
      userId: captainMarvel.id,
      type: 'debit_card',
      cardNumber: '****5678',
      cardHolder: 'Captain Marvel',
      expiryDate: '06/26',
      isDefault: true,
    },
  });

  await prisma.paymentMethod.create({
    data: {
      userId: captainAmerica.id,
      type: 'credit_card',
      cardNumber: '****9012',
      cardHolder: 'Captain America',
      expiryDate: '09/27',
      isDefault: true,
    },
  });

  console.log('✅ Payment methods created');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
