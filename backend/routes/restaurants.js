import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/restaurants/matches?userId=X
// Returns restaurants whose cuisine matches the user's right-swiped dish categories.
// Falls back to top 10 restaurants if no swipes or no match.
router.get('/matches', async (req, res) => {
  const { userId } = req.query;

  try {
    if (userId) {
      const rightSwipes = await prisma.swipe.findMany({
        where: { userId: parseInt(userId), swipeDirection: 'right' },
        include: { dish: true },
      });

      if (rightSwipes.length > 0) {
        const likedCategories = [
          ...new Set(rightSwipes.map((s) => s.dish.category).filter(Boolean)),
        ];

        const allRestaurants = await prisma.restaurant.findMany();
        const matched = allRestaurants.filter((r) =>
          likedCategories.some(
            (cat) =>
              r.cuisine?.toLowerCase().includes(cat.toLowerCase()) ||
              cat.toLowerCase().includes(r.cuisine?.toLowerCase())
          )
        );

        return res.json(matched.length > 0 ? matched : allRestaurants.slice(0, 6));
      }
    }

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
