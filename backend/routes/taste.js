import express from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../lib/auth.js';
import { buildTasteProfile } from '../lib/matching.js';

const router = express.Router();

// GET /api/taste — taste profile + stats for the profile screen
router.get('/', requireAuth, async (req, res) => {
  try {
    const [swipes, savedCount] = await Promise.all([
      prisma.swipe.findMany({ where: { userId: req.userId }, include: { dish: true } }),
      prisma.savedRestaurant.count({ where: { userId: req.userId } }),
    ]);
    const { likedByCategory: _l, ...taste } = buildTasteProfile(swipes);
    res.json({ ...taste, savedCount });
  } catch (err) {
    console.error('[GET /taste]', err);
    res.status(500).json({ error: 'Could not load your taste profile.' });
  }
});

export default router;
