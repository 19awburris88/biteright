import express from 'express';
import prisma from '../lib/prisma.js';
import { optionalAuth } from '../lib/auth.js';

const router = express.Router();

// Which dish diets satisfy each user diet.
const DIET_RULES = {
  vegan: ['vegan'],
  vegetarian: ['vegetarian', 'vegan'],
  pescatarian: ['pescatarian', 'vegetarian', 'vegan'],
};

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// GET /api/dishes/deck — unswiped dishes for the signed-in user (or all, for guests),
// filtered by diet, with favorite categories shuffled toward the front.
router.get('/deck', optionalAuth, async (req, res) => {
  try {
    const user = req.userId
      ? await prisma.user.findUnique({ where: { id: req.userId } })
      : null;

    const swiped = user
      ? (await prisma.swipe.findMany({ where: { userId: user.id }, select: { dishId: true } })).map(
          (s) => s.dishId
        )
      : [];

    let dishes = await prisma.dish.findMany({
      where: { id: { notIn: swiped }, imageUrl: { not: null } },
    });

    for (const diet of user?.dietaryTags || []) {
      const allowed = DIET_RULES[diet];
      if (allowed) dishes = dishes.filter((d) => d.dietary.some((x) => allowed.includes(x)));
    }

    const favorites = new Set(user?.favoriteCategories || []);
    const preferred = shuffle(dishes.filter((d) => favorites.has(d.category)));
    const rest = shuffle(dishes.filter((d) => !favorites.has(d.category)));

    // Interleave so favorites lead without making the deck one-note.
    const deck = [];
    while (preferred.length || rest.length) {
      if (preferred.length) deck.push(preferred.shift());
      if (preferred.length) deck.push(preferred.shift());
      if (rest.length) deck.push(rest.shift());
    }

    res.json({ dishes: deck, swipedCount: swiped.length });
  } catch (err) {
    console.error('[GET /dishes/deck]', err);
    res.status(500).json({ error: 'Could not load dishes.' });
  }
});

// GET /api/dishes/categories — category list with a cover photo each
router.get('/categories', async (_req, res) => {
  try {
    const dishes = await prisma.dish.findMany({ orderBy: { id: 'asc' } });
    const byCategory = new Map();
    for (const d of dishes) {
      if (!d.category) continue;
      const entry = byCategory.get(d.category) || { name: d.category, count: 0, imageUrl: d.imageUrl };
      entry.count += 1;
      byCategory.set(d.category, entry);
    }
    res.json([...byCategory.values()]);
  } catch (err) {
    console.error('[GET /dishes/categories]', err);
    res.status(500).json({ error: 'Could not load categories.' });
  }
});

export default router;
