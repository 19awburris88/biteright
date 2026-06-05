import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/user — create or find user by email
router.post('/', async (req, res) => {
  const { name, email, zipcode } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || '',
          email,
          password: 'placeholder',
          zipcode: zipcode || '00000',
        },
      });
    }
    res.json(user);
  } catch (err) {
    console.error('[POST /user] Error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /api/user/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/user/:id
router.put('/:id', async (req, res) => {
  const { zipcode, distanceRange, dietaryTags, pricePreference } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { zipcode, distanceRange, dietaryTags, pricePreference },
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
