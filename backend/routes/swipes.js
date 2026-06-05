import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/swipes?userId=X&direction=right
router.get('/', async (req, res) => {
  const { userId, direction } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    const where = { userId: parseInt(userId) };
    if (direction) where.swipeDirection = direction;

    const swipes = await prisma.swipe.findMany({
      where,
      include: { dish: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(swipes);
  } catch (err) {
    console.error('[GET /swipes] Error:', err);
    res.status(500).json({ error: 'Failed to fetch swipes' });
  }
});

// POST /api/swipes
router.post('/', async (req, res) => {
  const { userId, dishId, swipeDirection } = req.body;

  try {
    const swipe = await prisma.swipe.create({
      data: { userId, dishId, swipeDirection },
    });
    res.json(swipe);
  } catch (err) {
    console.error('[POST /swipes] Error:', err);
    res.status(500).json({ error: 'Failed to record swipe' });
  }
});

export default router;
