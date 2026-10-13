/**
 * Idempotent catalog sync — safe to run on every deploy.
 *   node backend/seed.js
 *
 * - Upserts every dish in data/dishes.json (matched by name).
 * - Upserts every open restaurant in data/restaurants.json (matched by name)
 *   and deactivates any restaurant that isn't on the open list, so closed
 *   places disappear from the app without breaking users' saved lists.
 */
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import prisma from './lib/prisma.js';

dotenv.config();

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (file) => JSON.parse(readFileSync(path.join(here, 'data', file), 'utf8'));

async function syncDishes() {
  const dishes = load('dishes.json');
  const existing = await prisma.dish.findMany({ select: { id: true, name: true } });
  const byName = new Map(existing.map((d) => [d.name, d.id]));

  for (const { name, category, flavorTags, dietary, imageUrl } of dishes) {
    const data = { name, category, flavorTags, dietary, imageUrl };
    const id = byName.get(name);
    if (id) await prisma.dish.update({ where: { id }, data });
    else await prisma.dish.create({ data });
  }
  return dishes.length;
}

async function syncRestaurants() {
  const all = load('restaurants.json');
  const open = all.filter((r) => !r.closed);
  const existing = await prisma.restaurant.findMany({ select: { id: true, name: true } });
  const byName = new Map(existing.map((r) => [r.name, r.id]));

  const keep = new Set();
  for (const r of open) {
    const data = {
      name: r.name,
      address: r.address,
      zipcode: r.zipcode,
      priceLevel: r.priceLevel || '', // '' = not verified; the app hides it
      phone: r.phone ?? null,
      website: r.website ?? null,
      imageUrl: r.imageUrl ?? null,
      cuisine: r.cuisine,
      neighborhood: r.neighborhood ?? null,
      categories: r.categories ?? [],
      dietary: r.dietary ?? [],
      lat: r.lat ?? null,
      lng: r.lng ?? null,
      active: true,
    };
    const id = byName.get(r.name);
    const saved = id
      ? await prisma.restaurant.update({ where: { id }, data })
      : await prisma.restaurant.create({ data });
    keep.add(saved.id);
  }

  const { count } = await prisma.restaurant.updateMany({
    where: { id: { notIn: [...keep] }, active: true },
    data: { active: false },
  });
  return { open: open.length, deactivated: count };
}

async function main() {
  const dishCount = await syncDishes();
  const { open, deactivated } = await syncRestaurants();
  console.log(`🍽️  Catalog synced: ${dishCount} dishes, ${open} open restaurants, ${deactivated} deactivated.`);
}

main()
  .catch((err) => {
    console.error('[seed] failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
