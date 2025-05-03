// routes/restaurants.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/restaurants/matches
router.get('/matches', async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      take: 10,
      orderBy: { id: 'asc' },
    });
    res.json(restaurants);
  } catch (err) {
    console.error('[GET /matches] Error:', err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

export default router;
