// Taste profile + restaurant matching.
//
// A user's taste is the share of their likes that fall in each dish category.
// A restaurant's match score is how much of that taste its categories cover,
// shaped onto a friendly 0–99 scale and nudged by price fit and diet.

const PRICE_RANK = { $: 1, $$: 2, $$$: 3, $$$$: 4 };

export function buildTasteProfile(swipes) {
  const likes = swipes.filter((s) => s.swipeDirection === 'right');
  const passes = swipes.filter((s) => s.swipeDirection === 'left');

  const categoryLikes = {};
  const categoryPasses = {};
  const flavorLikes = {};
  const likedByCategory = {};

  for (const s of likes) {
    const c = s.dish.category;
    if (c) {
      categoryLikes[c] = (categoryLikes[c] || 0) + 1;
      (likedByCategory[c] ||= []).push(s.dish.name);
    }
    for (const t of s.dish.flavorTags || []) flavorLikes[t] = (flavorLikes[t] || 0) + 1;
  }
  for (const s of passes) {
    const c = s.dish.category;
    if (c) categoryPasses[c] = (categoryPasses[c] || 0) + 1;
  }

  const totalLikes = likes.length;
  const categories = Object.entries(categoryLikes)
    .map(([name, count]) => ({
      name,
      likes: count,
      passes: categoryPasses[name] || 0,
      share: totalLikes ? count / totalLikes : 0,
    }))
    .sort((a, b) => b.likes - a.likes || a.passes - b.passes);

  const flavors = Object.entries(flavorLikes)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalSwipes: swipes.length,
    totalLikes,
    totalPasses: passes.length,
    categories,
    flavors,
    likedByCategory,
  };
}

export function scoreRestaurant(restaurant, taste, user) {
  const shares = Object.fromEntries(taste.categories.map((c) => [c.name, c.share]));
  const hits = (restaurant.categories || [])
    .filter((c) => shares[c])
    .sort((a, b) => shares[b] - shares[a]);

  const coverage = Math.min(1, hits.reduce((sum, c) => sum + shares[c], 0));
  if (coverage === 0) return null;

  let score = 42 + 57 * Math.sqrt(coverage);

  const maxPrice = PRICE_RANK[user?.pricePreference];
  const price = PRICE_RANK[restaurant.priceLevel];
  if (maxPrice && price && price > maxPrice) score -= 12 * (price - maxPrice);

  const diet = user?.dietaryTags || [];
  if (diet.includes('vegan') && restaurant.dietary?.includes('vegan-friendly')) score += 6;
  else if (
    (diet.includes('vegetarian') || diet.includes('vegan')) &&
    restaurant.dietary?.some((d) => d.endsWith('-friendly'))
  ) {
    score += 3;
  }

  const reasons = hits.slice(0, 2).map((category) => ({
    category,
    dishes: (taste.likedByCategory[category] || []).slice(0, 2),
  }));

  return {
    matchScore: Math.max(1, Math.min(99, Math.round(score))),
    matchedCategories: hits,
    reasons,
  };
}

export const MIN_LIKES_FOR_MATCHES = 3;
