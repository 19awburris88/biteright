import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

const foodImages = [
  faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'food' }),
  faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'food' }),
  faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'food' }),
  faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'food' }),
  faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'food' })
];

async function main() {
  await prisma.restaurant.createMany({
    data: [
      { name: "Velvet Taco", address: "3012 N Henderson Ave", zipcode: "75206", priceLevel: "$$", website: "https://velvettaco.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Mexican Fusion" },
      { name: "Rodeo Goat", address: "1926 Market Center Blvd", zipcode: "75207", priceLevel: "$$", website: "https://rodeogoat.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Burgers" },
      { name: "Pecan Lodge", address: "2702 Main St", zipcode: "75226", priceLevel: "$$", website: "https://pecanlodge.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Barbecue" },
      { name: "Mi Cocina", address: "3699 McKinney Ave", zipcode: "75204", priceLevel: "$$", website: "https://micocina.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Tex-Mex" },
      { name: "Lucia", address: "287 N Bishop Ave", zipcode: "75208", priceLevel: "$$$", website: "https://luciadallas.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Italian" },
      { name: "Drake’s", address: "5007 W Lovers Ln", zipcode: "75209", priceLevel: "$$$", website: "https://drakesdallas.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Steakhouse / American" },
      { name: "E-Bar Tex-Mex", address: "1901 N Haskell Ave", zipcode: "75204", priceLevel: "$$", website: "https://ebartexmex.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Tex-Mex" },
      { name: "Terry Black’s BBQ", address: "3025 Main St", zipcode: "75226", priceLevel: "$$", website: "https://terryblacksbbq.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Barbecue" },
      { name: "The Charles", address: "1632 Market Center Blvd", zipcode: "75207", priceLevel: "$$$", website: "https://thecharlesdallas.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Italian Fusion" },
      { name: "Yardbird Table & Bar", address: "2121 N Pearl St", zipcode: "75201", priceLevel: "$$$", website: "https://yardbirdrestaurants.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Southern American" },
      { name: "Gemma", address: "2323 N Henderson Ave", zipcode: "75206", priceLevel: "$$$", website: "https://gemmadallas.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "New American" },
      { name: "Sixty Vines", address: "500 Crescent Ct", zipcode: "75201", priceLevel: "$$$", website: "https://sixtyvines.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "New American" },
      { name: "Cane Rosso", address: "2612 Commerce St", zipcode: "75226", priceLevel: "$$", website: "https://canerosso.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Neapolitan Pizza" },
      { name: "Mesero", address: "2822 N Henderson Ave", zipcode: "75206", priceLevel: "$$", website: "https://mesero.net", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Modern Mexican" },
      { name: "Town Hearth", address: "1617 Market Center Blvd", zipcode: "75207", priceLevel: "$$$", website: "https://townhearth.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Steakhouse" },
      { name: "Uchi Dallas", address: "2817 Maple Ave", zipcode: "75201", priceLevel: "$$$", website: "https://uchidallas.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Japanese (Sushi)" },
      { name: "Knife Dallas", address: "5300 E Mockingbird Ln", zipcode: "75206", priceLevel: "$$$", website: "https://knife.texas", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Steakhouse" },
      { name: "Jaxon Beer Garden", address: "311 S Akard St", zipcode: "75202", priceLevel: "$$", website: "https://jaxonbeergarden.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "American" },
      { name: "Smoky Rose", address: "8602 Garland Rd", zipcode: "75218", priceLevel: "$$", website: "https://smokyrose.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Smokehouse / American" },
      { name: "Oddfellows", address: "316 W 7th St", zipcode: "75208", priceLevel: "$$", website: "https://oddfellowsdallas.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "American Brunch" },
      { name: "Tei-An", address: "1722 Routh St #110", zipcode: "75201", priceLevel: "$$$", website: "https://tei-an.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Japanese (Soba)" },
      { name: "Tejas", address: "1615 Main St", zipcode: "75201", priceLevel: "$$", website: "https://tejastexmex.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Tex-Mex" },
      { name: "José", address: "4931 W Lovers Ln", zipcode: "75209", priceLevel: "$$$", website: "https://josedallas.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Mexican" },
      { name: "Zoli’s Pizza", address: "14910 Midway Rd", zipcode: "75244", priceLevel: "$$", website: "https://zolispizza.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Pizza" },
      { name: "Maple & Motor", address: "4810 Maple Ave", zipcode: "75219", priceLevel: "$", website: "https://mapleandmotor.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Burgers" },
      { name: "Hudson House", address: "4448 Lovers Ln", zipcode: "75225", priceLevel: "$$", website: "https://hudsonhousehp.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "American Seafood" },
      { name: "Street’s Fine Chicken", address: "3857 Cedar Springs Rd", zipcode: "75219", priceLevel: "$$", website: "https://streetsfinechicken.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Southern Fried Chicken" },
      { name: "Malai Kitchen", address: "3699 McKinney Ave", zipcode: "75204", priceLevel: "$$", website: "https://malaikitchen.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Thai-Vietnamese" },
      { name: "La La Land Kind Cafe", address: "5626 Bell Ave", zipcode: "75206", priceLevel: "$", website: "https://lalalandkindcafe.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Coffee / Brunch" },
      { name: "CrushCraft Thai", address: "2800 Routh St #150", zipcode: "75201", priceLevel: "$", website: "https://crushcraftthai.com", imageUrl: faker.image.urlLoremFlickr({ width: 640, height: 480, category: 'city' }), cuisine: "Thai" }
    ]
  });

  const curatedDishes = [
    { name: "Brisket Plate", category: "BBQ", flavorTags: ["smoky", "savory"] },
    { name: "Pulled Pork Sandwich", category: "BBQ", flavorTags: ["savory", "juicy"] },
    { name: "Smoked Turkey", category: "BBQ", flavorTags: ["smoky", "lean"] },
    { name: "Burnt Ends", category: "BBQ", flavorTags: ["caramelized", "savory"] },
    { name: "BBQ Ribs", category: "BBQ", flavorTags: ["tender", "sweet", "smoky"] },
    { name: "Birria Tacos", category: "Tacos", flavorTags: ["spicy", "savory"] },
    { name: "Carnitas Tacos", category: "Tacos", flavorTags: ["crispy", "savory"] },
    { name: "Chicken Tinga Tacos", category: "Tacos", flavorTags: ["smoky", "spicy"] },
    { name: "Street Corn Elote", category: "Mexican", flavorTags: ["creamy", "spicy"] },
    { name: "Beef Enchiladas", category: "Mexican", flavorTags: ["savory", "cheesy"] },
    { name: "Spicy Tuna Roll", category: "Sushi", flavorTags: ["spicy", "fresh"] },
    { name: "Salmon Nigiri", category: "Sushi", flavorTags: ["fresh", "buttery"] },
    { name: "Pork Ramen", category: "Japanese", flavorTags: ["umami", "rich"] },
    { name: "Shrimp Tempura Roll", category: "Sushi", flavorTags: ["crispy", "light"] },
    { name: "Chicken Katsu", category: "Japanese", flavorTags: ["crispy", "savory"] },
    { name: "Pepperoni Pizza", category: "Pizza", flavorTags: ["savory", "cheesy"] },
    { name: "Margherita Pizza", category: "Pizza", flavorTags: ["fresh", "herby"] },
    { name: "BBQ Chicken Pizza", category: "Pizza", flavorTags: ["smoky", "sweet"] },
    { name: "White Truffle Pizza", category: "Pizza", flavorTags: ["earthy", "cheesy"] },
    { name: "Veggie Supreme Pizza", category: "Pizza", flavorTags: ["fresh", "crisp"] },
    { name: "Classic Cheeseburger", category: "Burgers", flavorTags: ["savory", "cheesy"] },
    { name: "Bacon Jam Burger", category: "Burgers", flavorTags: ["sweet", "salty"] },
    { name: "Spicy Fried Chicken Sandwich", category: "Sandwiches", flavorTags: ["spicy", "crispy"] },
    { name: "Pimento Cheese Burger", category: "Burgers", flavorTags: ["creamy", "savory"] },
    { name: "Avocado Toast", category: "Brunch", flavorTags: ["fresh", "creamy"] },
    { name: "Cobb Salad", category: "Salads", flavorTags: ["fresh", "hearty"] },
    { name: "Spicy Poke Bowl", category: "Bowls", flavorTags: ["spicy", "fresh"] },
    { name: "Caesar Salad", category: "Salads", flavorTags: ["creamy", "salty"] },
    { name: "Buddha Bowl", category: "Bowls", flavorTags: ["healthy", "fresh"] },
    { name: "Southwest Chicken Salad", category: "Salads", flavorTags: ["spicy", "savory"] },
    { name: "Grilled Salmon", category: "Seafood", flavorTags: ["fresh", "light"] },
    { name: "Lobster Roll", category: "Seafood", flavorTags: ["buttery", "fresh"] },
    { name: "Fish and Chips", category: "Seafood", flavorTags: ["crispy", "savory"] },
    { name: "Shrimp Tacos", category: "Tacos", flavorTags: ["fresh", "zesty"] },
    { name: "Crab Cakes", category: "Seafood", flavorTags: ["savory", "crispy"] },
    { name: "Chicken and Waffles", category: "Brunch", flavorTags: ["sweet", "savory"] },
    { name: "French Toast", category: "Brunch", flavorTags: ["sweet", "cinnamon"] },
    { name: "Eggs Benedict", category: "Brunch", flavorTags: ["rich", "buttery"] },
    { name: "Breakfast Burrito", category: "Brunch", flavorTags: ["hearty", "spicy"] },
    { name: "Banana Pancakes", category: "Brunch", flavorTags: ["sweet", "fluffy"] },
    { name: "Pad Thai", category: "Thai", flavorTags: ["sweet", "tangy"] },
    { name: "Massaman Curry", category: "Thai", flavorTags: ["spicy", "creamy"] },
    { name: "Pho", category: "Vietnamese", flavorTags: ["brothy", "herbal"] },
    { name: "Banh Mi Sandwich", category: "Vietnamese", flavorTags: ["crispy", "fresh"] },
    { name: "Butter Chicken", category: "Indian", flavorTags: ["creamy", "spicy"] }
  ];

  await prisma.dish.createMany({
    data: curatedDishes.map((dish) => ({
      ...dish,
      imageUrl: faker.helpers.arrayElement(foodImages),
    }))
  });

  console.log("🍴 Seeded curated dishes and restaurants with Faker images");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
