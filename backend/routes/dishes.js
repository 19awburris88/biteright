// GET /api/dishes/random
router.get('/random', async (req, res) => {
    try {
      const dishes = await prisma.dish.findMany({
        take: 30,
        orderBy: { id: 'asc' }, // optional: randomize or shuffle client-side
      });
      res.json(dishes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch dishes' });
    }
  });
  