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

  // ── Kategorien ───────────────────────────────────────────────
  const [
    menues,
    doener,
    wraps,
    pide,
    pizza,
    vorspeisen,
    beilagen,
    toppings,
    saucen,
    suessspeisen,
    getraenke,
  ] = await Promise.all([
    prisma.menuCategory.create({ data: { name: 'Menüs', sortOrder: 0 } }),
    prisma.menuCategory.create({
      data: { name: 'Döner Spezialitäten', sortOrder: 1 },
    }),
    prisma.menuCategory.create({
      data: { name: 'Wraps & Lahmacun', sortOrder: 2 },
    }),
    prisma.menuCategory.create({
      data: { name: 'Pide & Überbacken', sortOrder: 3 },
    }),
    prisma.menuCategory.create({ data: { name: 'Pizzen', sortOrder: 4 } }),
    prisma.menuCategory.create({
      data: { name: 'Vorspeisen & Salate', sortOrder: 5 },
    }),
    prisma.menuCategory.create({ data: { name: 'Beilagen', sortOrder: 6 } }),
    prisma.menuCategory.create({
      data: { name: 'Toppings & Salat', sortOrder: 7 },
    }),
    prisma.menuCategory.create({ data: { name: 'Saucen', sortOrder: 8 } }),
    prisma.menuCategory.create({ data: { name: 'Süßspeisen', sortOrder: 9 } }),
    prisma.menuCategory.create({ data: { name: 'Getränke', sortOrder: 10 } }),
  ]);

  // ── Menü-Positionen ──────────────────────────────────────────
  await prisma.menuItem.createMany({
    data: [
      // Döner Spezialitäten
      { categoryId: doener.id, sortOrder: 1,  type: MenuItemType.MAIN, name: 'Döner Tasche (klein)',            description: 'Rindfleisch im Fladenbrot mit Salat und Sauce',                                               price: 5.0  },
      { categoryId: doener.id, sortOrder: 2,  type: MenuItemType.MAIN, name: 'Döner Tasche (mittel)',           description: 'Rindfleisch im Fladenbrot mit Salat und Sauce',                                               price: 6.5  },
      { categoryId: doener.id, sortOrder: 3,  type: MenuItemType.MAIN, name: 'Döner Tasche (groß)',             description: 'Rindfleisch im Fladenbrot mit Salat und Sauce',                                               price: 8.5  },
      { categoryId: doener.id, sortOrder: 4,  type: MenuItemType.MAIN, name: 'Döner Tasche Hähnchen (klein)',   description: 'Hähnchenfleisch im Fladenbrot mit Salat und Sauce',                                           price: 5.0  },
      { categoryId: doener.id, sortOrder: 5,  type: MenuItemType.MAIN, name: 'Döner Tasche Hähnchen (mittel)',  description: 'Hähnchenfleisch im Fladenbrot mit Salat und Sauce',                                           price: 6.5  },
      { categoryId: doener.id, sortOrder: 6,  type: MenuItemType.MAIN, name: 'Döner Tasche Hähnchen (groß)',    description: 'Hähnchenfleisch im Fladenbrot mit Salat und Sauce',                                           price: 8.5  },
      { categoryId: doener.id, sortOrder: 7,  type: MenuItemType.MAIN, name: 'Dönerteller (klein)',             description: 'Rindfleisch mit Salat, Saucen und Pommes oder Reis',                                          price: 10.0 },
      { categoryId: doener.id, sortOrder: 8,  type: MenuItemType.MAIN, name: 'Dönerteller (groß)',              description: 'Rindfleisch mit Salat, Saucen und Pommes oder Reis',                                          price: 12.0 },
      { categoryId: doener.id, sortOrder: 9,  type: MenuItemType.MAIN, name: 'Dönerteller Hähnchen (klein)',    description: 'Hähnchenfleisch mit Salat, Saucen und Pommes oder Reis',                                      price: 10.0 },
      { categoryId: doener.id, sortOrder: 10, type: MenuItemType.MAIN, name: 'Dönerteller Hähnchen (groß)',     description: 'Hähnchenfleisch mit Salat, Saucen und Pommes oder Reis',                                      price: 12.0 },
      { categoryId: doener.id, sortOrder: 11, type: MenuItemType.MAIN, name: 'Döner Portion (klein)',           description: null,                                                                                          price: 10.0 },
      { categoryId: doener.id, sortOrder: 12, type: MenuItemType.MAIN, name: 'Döner Portion (groß)',            description: null,                                                                                          price: 12.0 },
      { categoryId: doener.id, sortOrder: 13, type: MenuItemType.MAIN, name: 'Iskender Kebap',                  description: 'Rindfleisch auf geröstetem Fladenbrot mit Spezialsauce, Joghurt und Beilagensalat',           price: 13.5 },
      { categoryId: doener.id, sortOrder: 14, type: MenuItemType.MAIN, name: 'Pomm Döner',                      description: 'Rind- oder Hähnchenfleisch mit Pommes',                                                      price: 6.5  },
      { categoryId: doener.id, sortOrder: 15, type: MenuItemType.MAIN, name: 'Sucuk Tasche (klein)',            description: 'Knoblauchwurst im Fladenbrot mit Salat',                                                     price: 5.0  },
      { categoryId: doener.id, sortOrder: 16, type: MenuItemType.MAIN, name: 'Sucuk Tasche (mittel)',           description: 'Knoblauchwurst im Fladenbrot mit Salat',                                                     price: 6.5  },
      { categoryId: doener.id, sortOrder: 17, type: MenuItemType.MAIN, name: 'Sucuk Tasche (groß)',             description: 'Knoblauchwurst im Fladenbrot mit Salat',                                                     price: 9.0  },
      { categoryId: doener.id, sortOrder: 18, type: MenuItemType.MAIN, name: 'Sucuk Teller (klein)',            description: 'Knoblauchwurst mit Salat, Sauce und Pommes oder Reis',                                       price: 10.0 },
      { categoryId: doener.id, sortOrder: 19, type: MenuItemType.MAIN, name: 'Sucuk Teller (groß)',             description: 'Knoblauchwurst mit Salat, Sauce und Pommes oder Reis',                                       price: 12.0 },
      { categoryId: doener.id, sortOrder: 20, type: MenuItemType.MAIN, name: 'Currywurst',                      description: 'Geflügelwurst mit Currysauce',                                                               price: 3.5  },
      { categoryId: doener.id, sortOrder: 21, type: MenuItemType.MAIN, name: 'Currywurst Pommes',               description: 'Geflügelwurst mit Currysauce und Pommes',                                                    price: 6.0  },
      { categoryId: doener.id, sortOrder: 22, type: MenuItemType.MAIN, name: 'Hähnchenschnitzel',               description: 'Mit Pommes oder Reis und Salat',                                                             price: 12.0 },
      { categoryId: doener.id, sortOrder: 23, type: MenuItemType.MAIN, name: 'Falafelteller',                   description: '6 Falafel mit Pommes oder Reis und Salat',                                                   price: 12.0 },
      { categoryId: doener.id, sortOrder: 24, type: MenuItemType.MAIN, name: 'Falafel Tasche',                  description: '4 Falafel im Brot mit Salat und Sauce',                                                      price: 6.5  },
      { categoryId: doener.id, sortOrder: 25, type: MenuItemType.MAIN, name: 'Salat Tasche',                    description: 'Salat im Brot mit Sauce',                                                                    price: 5.0  },
      { categoryId: doener.id, sortOrder: 26, type: MenuItemType.MAIN, name: 'Pommes Tasche',                   description: 'Pommes im Brot mit Salat und Sauce',                                                         price: 5.0  },
      { categoryId: doener.id, sortOrder: 27, type: MenuItemType.MAIN, name: 'Pommes (klein)',                   description: null,                                                                                          price: 3.0  },
      { categoryId: doener.id, sortOrder: 28, type: MenuItemType.MAIN, name: 'Pommes (groß)',                    description: null,                                                                                          price: 4.0  },

      // Wraps & Lahmacun
      {
        categoryId: wraps.id,
        sortOrder: 1,
        type: MenuItemType.MAIN,
        name: 'Dürüm Kalb',
        description: 'Rindfleisch im Wrap mit Salat und Sauce',
        price: 7.0,
      },
      {
        categoryId: wraps.id,
        sortOrder: 2,
        type: MenuItemType.MAIN,
        name: 'Dürüm Hähnchen',
        description: 'Hähnchenfleisch im Wrap mit Salat und Sauce',
        price: 7.0,
      },
      {
        categoryId: wraps.id,
        sortOrder: 3,
        type: MenuItemType.MAIN,
        name: 'Beyti Sarma',
        description:
          'Dönerfleisch eingerollt mit Tomatensauce, Joghurt und Beilagensalat',
        price: 14.0,
      },
      {
        categoryId: wraps.id,
        sortOrder: 4,
        type: MenuItemType.MAIN,
        name: 'Dürüm Falafel',
        description: 'Falafel im Wrap mit Salat und Sauce',
        price: 7.0,
      },
      {
        categoryId: wraps.id,
        sortOrder: 5,
        type: MenuItemType.MAIN,
        name: 'Lahmacun eingerollt',
        description: 'Mit Salat und Sauce eingerollt',
        price: 6.0,
      },
      {
        categoryId: wraps.id,
        sortOrder: 6,
        type: MenuItemType.MAIN,
        name: 'Lahmacun Teller',
        description: 'Lahmacun mit Salat und Sauce',
        price: 7.5,
      },
      {
        categoryId: wraps.id,
        sortOrder: 7,
        type: MenuItemType.MAIN,
        name: 'Lahmacun mit Fleisch',
        description:
          'Mit Rind- oder Hähnchenfleisch, Salat und Sauce eingerollt',
        price: 8.0,
      },

      // Pide & Überbacken
      {
        categoryId: pide.id,
        sortOrder: 1,
        type: MenuItemType.MAIN,
        name: 'Kuşbaşı Pide',
        description: 'Pide belegt mit Fleischstückchen und Gouda überbacken',
        price: 12.0,
      },
      {
        categoryId: pide.id,
        sortOrder: 2,
        type: MenuItemType.MAIN,
        name: 'Kıymalı Pide',
        description: 'Pide belegt mit Hackfleisch und Gouda überbacken',
        price: 10.0,
      },
      {
        categoryId: pide.id,
        sortOrder: 3,
        type: MenuItemType.MAIN,
        name: 'Peynirli Pide',
        description: 'Pide belegt mit Gouda überbacken',
        price: 9.5,
      },
      {
        categoryId: pide.id,
        sortOrder: 4,
        type: MenuItemType.MAIN,
        name: 'Sucuklu Pide',
        description: 'Pide belegt mit Knoblauchwurst und Gouda überbacken',
        price: 10.0,
      },
      {
        categoryId: pide.id,
        sortOrder: 5,
        type: MenuItemType.MAIN,
        name: 'Dönerli Pide',
        description:
          'Pide belegt mit Rind- oder Hähnchenfleisch und Gouda überbacken',
        price: 10.0,
      },
      {
        categoryId: pide.id,
        sortOrder: 6,
        type: MenuItemType.MAIN,
        name: 'Döner überbacken',
        description:
          'Döner mit Paprika, Zwiebeln und Tomatensahnesauce überbacken',
        price: 12.0,
      },

      // Pizzen
      {
        categoryId: pizza.id,
        sortOrder: 1,
        type: MenuItemType.MAIN,
        name: 'Pizza Margherita',
        description: 'Tomatensoße und Mozzarella',
        price: 9.0,
      },
      {
        categoryId: pizza.id,
        sortOrder: 2,
        type: MenuItemType.MAIN,
        name: 'Pizza Döner',
        description: 'Mit Dönerfleisch und Mozzarella',
        price: 10.5,
      },
      {
        categoryId: pizza.id,
        sortOrder: 3,
        type: MenuItemType.MAIN,
        name: 'Pizza Sucuk',
        description: 'Mit Knoblauchwurst und Mozzarella',
        price: 10.5,
      },
      {
        categoryId: pizza.id,
        sortOrder: 4,
        type: MenuItemType.MAIN,
        name: 'Pizza Funghi',
        description: 'Mit Champignons und Mozzarella',
        price: 10.5,
      },
      {
        categoryId: pizza.id,
        sortOrder: 5,
        type: MenuItemType.MAIN,
        name: 'Pizza Salami',
        description: 'Mit Salami und Mozzarella',
        price: 10.5,
      },
      {
        categoryId: pizza.id,
        sortOrder: 6,
        type: MenuItemType.MAIN,
        name: 'Pizza Tonno',
        description: 'Mit Thunfisch und Mozzarella',
        price: 10.5,
      },

      // Vorspeisen & Salate
      {
        categoryId: vorspeisen.id,
        sortOrder: 1,
        type: MenuItemType.MAIN,
        name: 'Sigara Börek',
        description: '4 Blätterteigsticks mit Käse gefüllt',
        price: 7.0,
      },
      {
        categoryId: vorspeisen.id,
        sortOrder: 2,
        type: MenuItemType.MAIN,
        name: 'Weinblätter',
        description: '4 Weinblätter mit Joghurt Dip',
        price: 7.0,
      },
      {
        categoryId: vorspeisen.id,
        sortOrder: 3,
        type: MenuItemType.MAIN,
        name: 'Mercimek Suppe',
        description: 'Türkische Linsensuppe',
        price: 6.0,
      },
      {
        categoryId: vorspeisen.id,
        sortOrder: 4,
        type: MenuItemType.MAIN,
        name: 'Iskembe Suppe',
        description: 'Türkische Pansensuppe',
        price: 6.5,
      },
      {
        categoryId: vorspeisen.id,
        sortOrder: 5,
        type: MenuItemType.MAIN,
        name: 'Gemischter Salat',
        description: 'Frischer gemischter Salat mit Dressing',
        price: 6.0,
      },
      {
        categoryId: vorspeisen.id,
        sortOrder: 6,
        type: MenuItemType.MAIN,
        name: 'Thunfischsalat',
        description: 'Salat mit Thunfisch',
        price: 8.0,
      },
      {
        categoryId: vorspeisen.id,
        sortOrder: 7,
        type: MenuItemType.MAIN,
        name: 'Dönersalat',
        description: 'Salat mit Rind- oder Hähnchenfleisch',
        price: 10.0,
      },

      // Beilagen
      {
        categoryId: beilagen.id,
        sortOrder: 1,
        type: MenuItemType.SIDE,
        name: 'Pommes',
        description: 'Portion Pommes',
        price: 0.0,
      },
      {
        categoryId: beilagen.id,
        sortOrder: 2,
        type: MenuItemType.SIDE,
        name: 'Reis',
        description: 'Portion Reis',
        price: 0.0,
      },

      // Toppings & Salat (€0,00 — in Preis inbegriffen bzw. Wunschänderung)
      {
        categoryId: toppings.id,
        sortOrder: 1,
        type: MenuItemType.TOPPING,
        name: 'Grünsalat',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 2,
        type: MenuItemType.TOPPING,
        name: 'Gurken',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 3,
        type: MenuItemType.TOPPING,
        name: 'Tomaten',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 4,
        type: MenuItemType.TOPPING,
        name: 'Zwiebeln',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 5,
        type: MenuItemType.TOPPING,
        name: 'Rotkohl',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 6,
        type: MenuItemType.TOPPING,
        name: 'Weißkohl',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 7,
        type: MenuItemType.TOPPING,
        name: 'Mais',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 8,
        type: MenuItemType.TOPPING,
        name: 'Paprika',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 9,
        type: MenuItemType.TOPPING,
        name: 'Gemischter Salat',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 10,
        type: MenuItemType.TOPPING,
        name: 'Ohne Tomaten',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 11,
        type: MenuItemType.TOPPING,
        name: 'Ohne Zwiebeln',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 12,
        type: MenuItemType.TOPPING,
        name: 'Ohne Salat',
        description: null,
        price: 0.0,
      },
      {
        categoryId: toppings.id,
        sortOrder: 13,
        type: MenuItemType.TOPPING,
        name: 'Extra scharf',
        description: null,
        price: 0.0,
      },

      // Saucen (€0,50 pro extra Sauce)
      {
        categoryId: saucen.id,
        sortOrder: 1,
        type: MenuItemType.TOPPING,
        name: 'Zaziki',
        description: 'Joghurt-Knoblauch-Sauce',
        price: 0.5,
      },
      {
        categoryId: saucen.id,
        sortOrder: 2,
        type: MenuItemType.TOPPING,
        name: 'Scharfe Sauce',
        description: null,
        price: 0.5,
      },
      {
        categoryId: saucen.id,
        sortOrder: 3,
        type: MenuItemType.TOPPING,
        name: 'Cocktailsauce',
        description: null,
        price: 0.5,
      },
      {
        categoryId: saucen.id,
        sortOrder: 4,
        type: MenuItemType.TOPPING,
        name: 'Knoblauchsauce',
        description: null,
        price: 0.5,
      },
      {
        categoryId: saucen.id,
        sortOrder: 5,
        type: MenuItemType.TOPPING,
        name: 'Kräutersauce',
        description: null,
        price: 0.5,
      },
      {
        categoryId: saucen.id,
        sortOrder: 6,
        type: MenuItemType.TOPPING,
        name: 'Currysauce',
        description: null,
        price: 0.5,
      },
      {
        categoryId: saucen.id,
        sortOrder: 7,
        type: MenuItemType.TOPPING,
        name: 'Mayonnaise',
        description: null,
        price: 0.5,
      },
      {
        categoryId: saucen.id,
        sortOrder: 8,
        type: MenuItemType.TOPPING,
        name: 'Ketchup',
        description: null,
        price: 0.5,
      },

      // Süßspeisen
      {
        categoryId: suessspeisen.id,
        sortOrder: 1,
        type: MenuItemType.MAIN,
        name: 'Künefe',
        description: 'Fadenteig mit Mozzarella Kern und Zuckersirup',
        price: 7.0,
      },
      {
        categoryId: suessspeisen.id,
        sortOrder: 2,
        type: MenuItemType.MAIN,
        name: 'Künefe mit Eis',
        description:
          'Fadenteig mit Mozzarella Kern, Zuckersirup und einer Kugel Eis',
        price: 8.0,
      },

      // Getränke
      {
        categoryId: getraenke.id,
        sortOrder: 1,
        type: MenuItemType.DRINK,
        name: 'Cola 0,33L',
        description: null,
        price: 1.75,
      },
      {
        categoryId: getraenke.id,
        sortOrder: 2,
        type: MenuItemType.DRINK,
        name: 'Cola Zero 0,33L',
        description: null,
        price: 1.75,
      },
      {
        categoryId: getraenke.id,
        sortOrder: 3,
        type: MenuItemType.DRINK,
        name: 'Fanta 0,33L',
        description: null,
        price: 1.75,
      },
      {
        categoryId: getraenke.id,
        sortOrder: 4,
        type: MenuItemType.DRINK,
        name: 'Fanta Exotic 0,33L',
        description: null,
        price: 1.75,
      },
      {
        categoryId: getraenke.id,
        sortOrder: 5,
        type: MenuItemType.DRINK,
        name: 'Ayran 0,33L',
        description: 'Türkisches Joghurtgetränk',
        price: 1.75,
      },
      {
        categoryId: getraenke.id,
        sortOrder: 6,
        type: MenuItemType.DRINK,
        name: 'Mineralwasser 0,33L',
        description: null,
        price: 1.75,
      },
      {
        categoryId: getraenke.id,
        sortOrder: 7,
        type: MenuItemType.DRINK,
        name: 'Stilles Wasser 0,33L',
        description: null,
        price: 1.75,
      },
      {
        categoryId: getraenke.id,
        sortOrder: 8,
        type: MenuItemType.DRINK,
        name: '1L Getränk',
        description: 'Cola, Fanta oder Mezzo Mix — 1 Liter',
        price: 3.5,
      },

      // Menüs
      {
        categoryId: menues.id,
        sortOrder: 1,
        type: MenuItemType.MAIN,
        name: 'Menü 1 — Döner Tasche',
        description: 'Döner Tasche mit Pommes und Getränk',
        price: 10.0,
      },
      {
        categoryId: menues.id,
        sortOrder: 2,
        type: MenuItemType.MAIN,
        name: 'Menü 2 — Lahmacun',
        description: 'Lahmacun mit Pommes und Getränk',
        price: 9.5,
      },
      {
        categoryId: menues.id,
        sortOrder: 3,
        type: MenuItemType.MAIN,
        name: 'Menü 3 — Dürüm Döner',
        description: 'Dürüm Döner mit Pommes und Getränk',
        price: 10.5,
      },
      {
        categoryId: menues.id,
        sortOrder: 4,
        type: MenuItemType.MAIN,
        name: 'Menü 4 — Pomm Döner',
        description: 'Pomm Döner mit Getränk',
        price: 8.0,
      },
      {
        categoryId: menues.id,
        sortOrder: 5,
        type: MenuItemType.MAIN,
        name: 'Menü 5 — Currywurst',
        description: 'Currywurst Pommes mit Dönerfleisch und Getränk',
        price: 11.0,
      },
      {
        categoryId: menues.id,
        sortOrder: 6,
        type: MenuItemType.MAIN,
        name: 'Menü 6 — Döner Teller',
        description: 'Döner Teller mit Pommes oder Reis und Getränk',
        price: 13.0,
      },
    ],
  });

  console.log('✓ Seed erfolgreich');
  console.log('  8 Tische');
  console.log('  11 Kategorien');
  console.log('  94 Menüpositionen');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
