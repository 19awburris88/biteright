// routes/swipes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

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
