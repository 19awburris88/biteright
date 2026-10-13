import express from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth, optionalAuth } from '../lib/auth.js';
import { buildTasteProfile, scoreRestaurant, MIN_LIKES_FOR_MATCHES } from '../lib/matching.js';

const router = express.Router();

async function loadTaste(userId) {
  const [user, swipes] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.swipe.findMany({ where: { userId }, include: { dish: true } }),
  ]);
  return { user, taste: buildTasteProfile(swipes) };
}

async function savedIds(userId) {
  if (!userId) return new Set();
  const rows = await prisma.savedRestaurant.findMany({ where: { userId }, select: { restaurantId: true } });
  return new Set(rows.map((r) => r.restaurantId));
}

// GET /api/restaurants — every active restaurant (Explore)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const [restaurants, saved] = await Promise.all([
      prisma.restaurant.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
      savedIds(req.userId),
    ]);
    res.json(restaurants.map((r) => ({ ...r, saved: saved.has(r.id) })));
  } catch (err) {
    console.error('[GET /restaurants]', err);
    res.status(500).json({ error: 'Could not load restaurants.' });
  }
});

// GET /api/restaurants/matches — ranked by taste
router.get('/matches', requireAuth, async (req, res) => {
  try {
    const [{ user, taste }, restaurants, saved] = await Promise.all([
      loadTaste(req.userId),
      prisma.restaurant.findMany({ where: { active: true } }),
      savedIds(req.userId),
    ]);

    if (taste.totalLikes < MIN_LIKES_FOR_MATCHES) {
      return res.json({ locked: true, likesNeeded: MIN_LIKES_FOR_MATCHES - taste.totalLikes, taste, matches: [] });
    }

    const matches = restaurants
      .map((r) => {
        const score = scoreRestaurant(r, taste, user);
        return score && { ...r, ...score, saved: saved.has(r.id) };
      })
      .filter(Boolean)
      .sort((a, b) => b.matchScore - a.matchScore || a.name.localeCompare(b.name));

    res.json({ locked: false, likesNeeded: 0, taste, matches });
  } catch (err) {
    console.error('[GET /restaurants/matches]', err);
    res.status(500).json({ error: 'Could not load your matches.' });
  }
});

// GET /api/restaurants/saved
router.get('/saved', requireAuth, async (req, res) => {
  try {
    const rows = await prisma.savedRestaurant.findMany({
      where: { userId: req.userId, restaurant: { active: true } },
      include: { restaurant: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(rows.map((r) => ({ ...r.restaurant, saved: true, savedAt: r.createdAt })));
  } catch (err) {
    console.error('[GET /restaurants/saved]', err);
    res.status(500).json({ error: 'Could not load saved restaurants.' });
  }
});

// GET /api/restaurants/:id — detail, with match info when signed in
router.get('/:id', optionalAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(404).json({ error: 'Restaurant not found.' });

  try {
    const restaurant = await prisma.restaurant.findFirst({ where: { id, active: true } });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found.' });

    let match = null;
    let saved = false;
    if (req.userId) {
      const { user, taste } = await loadTaste(req.userId);
      if (taste.totalLikes >= MIN_LIKES_FOR_MATCHES) match = scoreRestaurant(restaurant, taste, user);
      saved = (await savedIds(req.userId)).has(id);
    }

    res.json({ ...restaurant, ...(match || {}), saved });
  } catch (err) {
    console.error('[GET /restaurants/:id]', err);
    res.status(500).json({ error: 'Could not load this restaurant.' });
  }
});

// PUT /api/restaurants/:id/save  ·  DELETE /api/restaurants/:id/save
router.put('/:id/save', requireAuth, async (req, res) => {
  const restaurantId = Number(req.params.id);
  try {
    await prisma.savedRestaurant.upsert({
      where: { userId_restaurantId: { userId: req.userId, restaurantId } },
      create: { userId: req.userId, restaurantId },
      update: {},
    });
    res.json({ saved: true });
  } catch (err) {
    if (err.code === 'P2003') return res.status(404).json({ error: 'Restaurant not found.' });
    console.error('[PUT /restaurants/:id/save]', err);
    res.status(500).json({ error: 'Could not save this restaurant.' });
  }
});

router.delete('/:id/save', requireAuth, async (req, res) => {
  try {
    await prisma.savedRestaurant.deleteMany({
      where: { userId: req.userId, restaurantId: Number(req.params.id) },
    });
    res.json({ saved: false });
  } catch (err) {
    console.error('[DELETE /restaurants/:id/save]', err);
    res.status(500).json({ error: 'Could not update saved restaurants.' });
  }
});

export default router;
