import express from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../lib/auth.js';

const router = express.Router();
router.use(requireAuth);

const DIRECTIONS = ['left', 'right'];

// GET /api/swipes?direction=right
router.get('/', async (req, res) => {
  const where = { userId: req.userId };
  if (DIRECTIONS.includes(req.query.direction)) where.swipeDirection = req.query.direction;

  try {
    const swipes = await prisma.swipe.findMany({
      where,
      include: { dish: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(swipes);
  } catch (err) {
    console.error('[GET /swipes]', err);
    res.status(500).json({ error: 'Could not load your swipes.' });
  }
});

// POST /api/swipes — record (or change) a swipe
router.post('/', async (req, res) => {
  const dishId = Number(req.body.dishId);
  const swipeDirection = req.body.swipeDirection;
  if (!dishId || !DIRECTIONS.includes(swipeDirection)) {
    return res.status(400).json({ error: 'dishId and a valid swipeDirection are required.' });
  }

  try {
    const swipe = await prisma.swipe.upsert({
      where: { userId_dishId: { userId: req.userId, dishId } },
      create: { userId: req.userId, dishId, swipeDirection },
      update: { swipeDirection, createdAt: new Date() },
    });
    res.json(swipe);
  } catch (err) {
    if (err.code === 'P2003') return res.status(404).json({ error: 'Dish not found.' });
    console.error('[POST /swipes]', err);
    res.status(500).json({ error: 'Could not save that swipe.' });
  }
});

// POST /api/swipes/bulk — import swipes made as a guest before signing up
router.post('/bulk', async (req, res) => {
  const items = Array.isArray(req.body.swipes) ? req.body.swipes.slice(0, 500) : [];
  const valid = items.filter((s) => Number(s.dishId) && DIRECTIONS.includes(s.swipeDirection));

  try {
    const existingDishIds = new Set(
      (await prisma.dish.findMany({ select: { id: true } })).map((d) => d.id)
    );
    await prisma.$transaction(
      valid
        .filter((s) => existingDishIds.has(Number(s.dishId)))
        .map((s) =>
          prisma.swipe.upsert({
            where: { userId_dishId: { userId: req.userId, dishId: Number(s.dishId) } },
            create: { userId: req.userId, dishId: Number(s.dishId), swipeDirection: s.swipeDirection },
            update: { swipeDirection: s.swipeDirection },
          })
        )
    );
    res.json({ imported: valid.length });
  } catch (err) {
    console.error('[POST /swipes/bulk]', err);
    res.status(500).json({ error: 'Could not import your swipes.' });
  }
});

// DELETE /api/swipes/:dishId — undo a swipe / remove a like
router.delete('/:dishId', async (req, res) => {
  try {
    await prisma.swipe.deleteMany({ where: { userId: req.userId, dishId: Number(req.params.dishId) } });
    res.status(204).end();
  } catch (err) {
    console.error('[DELETE /swipes/:dishId]', err);
    res.status(500).json({ error: 'Could not undo that swipe.' });
  }
});

// DELETE /api/swipes?direction=left — reset passes only, or (no direction) the whole taste profile
router.delete('/', async (req, res) => {
  const where = { userId: req.userId };
  if (DIRECTIONS.includes(req.query.direction)) where.swipeDirection = req.query.direction;
  try {
    await prisma.swipe.deleteMany({ where });
    res.status(204).end();
  } catch (err) {
    console.error('[DELETE /swipes]', err);
    res.status(500).json({ error: 'Could not reset your swipes.' });
  }
});

export default router;
