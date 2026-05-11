import 'dotenv/config';
import { PrismaClient, MenuItemType } from '../src/__generated__/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  // ── Cleanup ──────────────────────────────────────────────────
  await prisma.paymentItemAllocation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.table.deleteMany();

  // ── Tische ───────────────────────────────────────────────────
  await prisma.table.createMany({
    data: [
      { number: 1, name: 'Tisch 1', capacity: 2 },
      { number: 2, name: 'Tisch 2', capacity: 2 },
      { number: 3, name: 'Tisch 3', capacity: 4 },
      { number: 4, name: 'Tisch 4', capacity: 4 },
      { number: 5, name: 'Tisch 5', capacity: 4 },
      { number: 6, name: 'Tisch 6', capacity: 6 },
      { number: 7, name: 'Terrasse 1', capacity: 4 },
      { number: 8, name: 'Terrasse 2', capacity: 6 },
    ],
  });

  // ── Menü-Kategorien ──────────────────────────────────────────
  const [vorspeisen, hauptgerichte, desserts, getraenke] = await Promise.all([
    prisma.menuCategory.create({ data: { name: 'Vorspeisen', sortOrder: 1 } }),
    prisma.menuCategory.create({ data: { name: 'Hauptgerichte', sortOrder: 2 } }),
    prisma.menuCategory.create({ data: { name: 'Desserts', sortOrder: 3 } }),
    prisma.menuCategory.create({ data: { name: 'Getränke', sortOrder: 4 } }),
  ]);

  // ── Menü-Positionen ──────────────────────────────────────────
  await prisma.menuItem.createMany({
    data: [
      // Vorspeisen
      { categoryId: vorspeisen.id, name: 'Bruschetta', price: 6.5, type: MenuItemType.MAIN, sortOrder: 1 },
      { categoryId: vorspeisen.id, name: 'Tomatensuppe', price: 7.0, type: MenuItemType.MAIN, sortOrder: 2 },
      { categoryId: vorspeisen.id, name: 'Mozzarella Caprese', price: 8.5, type: MenuItemType.MAIN, sortOrder: 3 },

      // Hauptgerichte
      { categoryId: hauptgerichte.id, name: 'Pizza Margherita', price: 11.0, type: MenuItemType.MAIN, sortOrder: 1 },
      { categoryId: hauptgerichte.id, name: 'Pizza Salami', price: 12.5, type: MenuItemType.MAIN, sortOrder: 2 },
      { categoryId: hauptgerichte.id, name: 'Spaghetti Bolognese', price: 13.5, type: MenuItemType.MAIN, sortOrder: 3 },
      { categoryId: hauptgerichte.id, name: 'Risotto ai Funghi', price: 14.0, type: MenuItemType.MAIN, sortOrder: 4 },
      { categoryId: hauptgerichte.id, name: 'Chicken Parmigiana', price: 16.5, type: MenuItemType.MAIN, sortOrder: 5 },
      { categoryId: hauptgerichte.id, name: 'Rumpsteak 200g', price: 24.0, type: MenuItemType.MAIN, sortOrder: 6 },

      // Desserts
      { categoryId: desserts.id, name: 'Tiramisu', price: 6.0, type: MenuItemType.MAIN, sortOrder: 1 },
      { categoryId: desserts.id, name: 'Panna Cotta', price: 5.5, type: MenuItemType.MAIN, sortOrder: 2 },
      { categoryId: desserts.id, name: 'Schokoladenkuchen', price: 6.5, type: MenuItemType.MAIN, sortOrder: 3 },

      // Getränke
      { categoryId: getraenke.id, name: 'Wasser 0,5l', price: 3.0, type: MenuItemType.DRINK, sortOrder: 1 },
      { categoryId: getraenke.id, name: 'Cola 0,3l', price: 3.5, type: MenuItemType.DRINK, sortOrder: 2 },
      { categoryId: getraenke.id, name: 'Bier 0,5l', price: 4.0, type: MenuItemType.DRINK, sortOrder: 3 },
      { categoryId: getraenke.id, name: 'Hauswein Rot 0,2l', price: 5.5, type: MenuItemType.DRINK, sortOrder: 4 },
      { categoryId: getraenke.id, name: 'Hauswein Weiß 0,2l', price: 5.5, type: MenuItemType.DRINK, sortOrder: 5 },
      { categoryId: getraenke.id, name: 'Espresso', price: 2.5, type: MenuItemType.DRINK, sortOrder: 6 },
    ],
  });

  console.log('Seed erfolgreich');
  console.log('  8 Tische');
  console.log('  4 Kategorien');
  console.log('  18 Menuepositionen');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
