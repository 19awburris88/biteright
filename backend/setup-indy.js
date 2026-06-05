/**
 * setup-indy.js
 * Run from /backend:  node setup-indy.js
 *
 * 1. Updates every dish with a curated, per-dish Unsplash food photo
 * 2. Replaces all restaurants with real Indianapolis restaurants
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Dish image map (id → Unsplash photo URL) ────────────────────────────────
const u = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=600&q=80`;

const DISH_IMAGES = {
  // BBQ
  1:  u('1529193591184-b1d58069ecdd'), // Brisket Plate
  2:  u('1544025162-d76538724790'),    // Pulled Pork Sandwich
  3:  u('1555396273-367ea4eb4db5'),    // Smoked Turkey
  4:  u('1529193591184-b1d58069ecdd'), // Burnt Ends
  5:  u('1544025162-d76538724790'),    // BBQ Ribs

  // Tacos & Mexican
  6:  u('1551504734-5da7e163aa44'),    // Birria Tacos
  7:  u('1551504734-5da7e163aa44'),    // Carnitas Tacos
  8:  u('1647163289349-1d2c2440d17d'), // Chicken Tinga Tacos
  9:  u('1615870216519-2f9fa575fa5c'), // Street Corn Elote
  10: u('1534422298391-e4f8c172dddb'), // Beef Enchiladas

  // Sushi & Japanese
  11: u('1617196034183-421b4040d20e'), // Spicy Tuna Roll
  12: u('1553621042-f6e147245754'),    // Salmon Nigiri
  13: u('1569050467447-ce54b3bbc37d'), // Pork Ramen
  14: u('1611143669185-af224c5e3252'), // Shrimp Tempura Roll
  15: u('1569050467447-ce54b3bbc37d'), // Chicken Katsu (use ramen style bowl)

  // Pizza
  16: u('1513104890138-7c749659a591'), // Pepperoni Pizza
  17: u('1565299624946-b28f40a0ae38'), // Margherita Pizza
  18: u('1565299624946-b28f40a0ae38'), // BBQ Chicken Pizza
  19: u('1571407970349-bc81e71e5d9c'), // White Truffle Pizza
  20: u('1513104890138-7c749659a591'), // Veggie Supreme Pizza

  // Burgers & Sandwiches
  21: u('1568901346375-23c9450c58cd'), // Classic Cheeseburger
  22: u('1594212699903-ec8a3eca50f5'), // Bacon Jam Burger
  23: u('1550547660-d9450f859349'),    // Spicy Fried Chicken Sandwich
  24: u('1568901346375-23c9450c58cd'), // Pimento Cheese Burger

  // Brunch
  25: u('1541519481893-6f0e58ae62fd'), // Avocado Toast
  26: u('1546793665-c74683f339c1'),    // Cobb Salad
  27: u('1580822184713-fc5400e7fe10'), // Spicy Poke Bowl
  28: u('1512621776951-a57141f2eefd'), // Caesar Salad
  29: u('1546069901-ba9599a7e63c'),    // Buddha Bowl
  30: u('1540189549336-e6e99eb4b951'), // Southwest Chicken Salad

  // Seafood
  31: u('1519708227418-c8fd9a32b7a2'), // Grilled Salmon
  32: u('1534080564583-6be75777b70a'), // Lobster Roll
  33: u('1559410545-0bdcd187e0a6'),    // Fish and Chips
  34: u('1551504734-5da7e163aa44'),    // Shrimp Tacos
  35: u('1559410545-0bdcd187e0a6'),    // Crab Cakes

  // Brunch cont.
  36: u('1504754524776-8f4f37790ca0'), // Chicken and Waffles
  37: u('1484723091739-30a097e8f929'), // French Toast
  38: u('1544145945-f90425340c7e'),    // Eggs Benedict
  39: u('1481931098730-318b6f776db0'), // Breakfast Burrito
  40: u('1476224203421-9ac39bcb3327'), // Banana Pancakes

  // Asian
  41: u('1562802378-063ec186a863'),    // Pad Thai
  42: u('1588166524941-3bf61a9c41db'), // Massaman Curry
  43: u('1511910849309-0dffb8785146'), // Pho
  44: u('1509722747041-616f39b57564'), // Banh Mi Sandwich
  45: u('1585937421612-70a008356fbe'), // Butter Chicken
};

// ─── Indianapolis restaurants ─────────────────────────────────────────────────
const INDIANAPOLIS_RESTAURANTS = [
  {
    name: 'St. Elmo Steak House',
    address: '127 S Illinois St, Indianapolis, IN',
    zipcode: '46225',
    priceLevel: '$$$',
    phone: '(317) 635-0636',
    website: 'https://www.stelmos.com',
    cuisine: 'Steakhouse',
    imageUrl: u('1558030006-450675393462'),
  },
  {
    name: "Harry & Izzy's",
    address: '153 S Illinois St, Indianapolis, IN',
    zipcode: '46225',
    priceLevel: '$$$',
    phone: '(317) 635-9594',
    website: 'https://www.harryandizzys.com',
    cuisine: 'Steakhouse / American',
    imageUrl: u('1544025162-d76538724790'),
  },
  {
    name: 'Milktooth',
    address: '534 Virginia Ave, Indianapolis, IN',
    zipcode: '46203',
    priceLevel: '$$',
    phone: '(317) 986-5131',
    website: 'https://milktoothbar.com',
    cuisine: 'Brunch / American',
    imageUrl: u('1504754524776-8f4f37790ca0'),
  },
  {
    name: 'Bluebeard',
    address: '653 Virginia Ave, Indianapolis, IN',
    zipcode: '46203',
    priceLevel: '$$',
    phone: '(317) 686-1580',
    website: 'https://www.bluebeardrestaurant.com',
    cuisine: 'New American',
    imageUrl: u('1414235077428-338989a02a87'),
  },
  {
    name: 'Rook',
    address: '501 Virginia Ave Suite 105, Indianapolis, IN',
    zipcode: '46203',
    priceLevel: '$$',
    phone: '(317) 737-2293',
    website: 'https://rookindy.com',
    cuisine: 'Asian Fusion',
    imageUrl: u('1567620905732-2d1ec7ab7445'),
  },
  {
    name: 'Tinker Street',
    address: '402 E 16th St, Indianapolis, IN',
    zipcode: '46202',
    priceLevel: '$$',
    phone: '(317) 925-5000',
    website: 'https://www.tinkerstreetrestaurant.com',
    cuisine: 'New American',
    imageUrl: u('1540189549336-e6e99eb4b951'),
  },
  {
    name: 'Napolese',
    address: '30 S Meridian St, Indianapolis, IN',
    zipcode: '46204',
    priceLevel: '$$',
    phone: '(317) 951-9170',
    website: 'https://napolese.com',
    cuisine: 'Neapolitan Pizza',
    imageUrl: u('1565299624946-b28f40a0ae38'),
  },
  {
    name: 'The Eagle Food & Beer Hall',
    address: '310 Massachusetts Ave, Indianapolis, IN',
    zipcode: '46204',
    priceLevel: '$$',
    phone: '(317) 550-3243',
    website: 'https://www.eaglefoodandbeer.com',
    cuisine: 'Southern Fried Chicken',
    imageUrl: u('1504754524776-8f4f37790ca0'),
  },
  {
    name: 'Thunderbird',
    address: '1127 Shelby St, Indianapolis, IN',
    zipcode: '46203',
    priceLevel: '$$',
    phone: '(317) 974-9580',
    website: 'https://www.thunderbirdindy.com',
    cuisine: 'Southern American',
    imageUrl: u('1512621776951-a57141f2eefd'),
  },
  {
    name: "Goose the Market",
    address: '2503 N Delaware St, Indianapolis, IN',
    zipcode: '46205',
    priceLevel: '$$',
    phone: '(317) 924-4944',
    website: 'https://www.goosethemarket.com',
    cuisine: 'Deli / Sandwiches',
    imageUrl: u('1509722747041-616f39b57564'),
  },
  {
    name: 'Mimi Blue Meatballs',
    address: '4 E Vermont St, Indianapolis, IN',
    zipcode: '46204',
    priceLevel: '$$',
    phone: '(317) 643-8181',
    website: 'https://mimiblue.com',
    cuisine: 'Italian',
    imageUrl: u('1571407970349-bc81e71e5d9c'),
  },
  {
    name: 'Beholder',
    address: '1844 E 10th St, Indianapolis, IN',
    zipcode: '46201',
    priceLevel: '$$$',
    phone: '(317) 426-2460',
    website: 'https://www.beholderindy.com',
    cuisine: 'New American',
    imageUrl: u('1414235077428-338989a02a87'),
  },
  {
    name: 'Café Patachou',
    address: '4901 N Pennsylvania St, Indianapolis, IN',
    zipcode: '46205',
    priceLevel: '$$',
    phone: '(317) 925-2823',
    website: 'https://www.patachouinc.com',
    cuisine: 'French-American Brunch',
    imageUrl: u('1476224203421-9ac39bcb3327'),
  },
  {
    name: 'Bru Burger Bar',
    address: '410 Massachusetts Ave, Indianapolis, IN',
    zipcode: '46204',
    priceLevel: '$$',
    phone: '(317) 635-6278',
    website: 'https://www.bruburgerbarindy.com',
    cuisine: 'Burgers',
    imageUrl: u('1568901346375-23c9450c58cd'),
  },
  {
    name: 'Mesh',
    address: '725 Massachusetts Ave, Indianapolis, IN',
    zipcode: '46204',
    priceLevel: '$$$',
    phone: '(317) 955-9600',
    website: 'https://meshrestaurant.com',
    cuisine: 'New American',
    imageUrl: u('1546069901-ba9599a7e63c'),
  },
  {
    name: "MacNiven's Restaurant & Bar",
    address: '339 Massachusetts Ave, Indianapolis, IN',
    zipcode: '46204',
    priceLevel: '$$',
    phone: '(317) 632-7268',
    website: 'https://www.macnivens.com',
    cuisine: 'Scottish / American',
    imageUrl: u('1544025162-d76538724790'),
  },
  {
    name: 'Sun King Brewery',
    address: '135 N College Ave, Indianapolis, IN',
    zipcode: '46202',
    priceLevel: '$$',
    phone: '(317) 602-3702',
    website: 'https://www.sunkingbrewing.com',
    cuisine: 'Pub / American',
    imageUrl: u('1594212699903-ec8a3eca50f5'),
  },
  {
    name: 'Cerulean',
    address: '339 S Delaware St, Indianapolis, IN',
    zipcode: '46204',
    priceLevel: '$$$',
    phone: '(317) 624-9500',
    website: 'https://ceruleanindy.com',
    cuisine: 'Fine Dining / New American',
    imageUrl: u('1414235077428-338989a02a87'),
  },
  {
    name: "Ezra's Enlightened Cafe",
    address: '1501 N Talbott St, Indianapolis, IN',
    zipcode: '46202',
    priceLevel: '$',
    phone: '(317) 602-0585',
    website: 'https://www.ezrasenlightened.com',
    cuisine: 'Vegan / Healthy',
    imageUrl: u('1512621776951-a57141f2eefd'),
  },
  {
    name: 'Libertine Liquor Bar',
    address: '38 S College Ave, Indianapolis, IN',
    zipcode: '46202',
    priceLevel: '$$',
    phone: '(317) 631-0014',
    website: 'https://www.libertineliquorbar.com',
    cuisine: 'American Small Plates',
    imageUrl: u('1540189549336-e6e99eb4b951'),
  },
];

async function main() {
  console.log('Updating dish images...');
  for (const [idStr, imageUrl] of Object.entries(DISH_IMAGES)) {
    await prisma.dish.update({
      where: { id: parseInt(idStr) },
      data: { imageUrl },
    });
  }
  console.log(`✓ Updated ${Object.keys(DISH_IMAGES).length} dish images`);

  console.log('Replacing restaurants with Indianapolis data...');
  await prisma.restaurantDish.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.restaurant.createMany({ data: INDIANAPOLIS_RESTAURANTS });
  console.log(`✓ Added ${INDIANAPOLIS_RESTAURANTS.length} Indianapolis restaurants`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
