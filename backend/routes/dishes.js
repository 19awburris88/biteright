import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/random', async (req, res) => {
  try {
    const allDishes = await prisma.dish.findMany();
    const shuffled = allDishes.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 30);
    res.json(selected);
  } catch (err) {
    console.error('[GET /api/dishes/random] Error:', err);
    res.status(500).json({ error: 'Failed to fetch random dishes' });
  }
});

export default router;
