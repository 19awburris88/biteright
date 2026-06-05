import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';

const CATEGORY_EMOJI = {
  BBQ: '🔥', Tacos: '🌮', Mexican: '🌶️', Sushi: '🍣', Japanese: '🍜',
  Pizza: '🍕', Burgers: '🍔', Sandwiches: '🥪', Brunch: '🥞',
  Salads: '🥗', Bowls: '🥣', Seafood: '🦞', Thai: '🍲', Vietnamese: '🍃',
  Indian: '🫕', default: '🍽️',
};

function DishCard({ dish }) {
  const emoji = CATEGORY_EMOJI[dish.category] || CATEGORY_EMOJI.default;
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        bgcolor: '#1F2937',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      elevation={0}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2,
          bgcolor: 'rgba(247,37,69,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          flexShrink: 0,
        }}
      >
        {emoji}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight="bold" color="#F8FAFC" noWrap>
          {dish.name}
        </Typography>
        <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap" gap={0.5}>
          {dish.flavorTags.slice(0, 2).map((tag, i) => (
            <Chip
              key={i}
              label={tag}
              size="small"
              sx={{
                bgcolor: 'rgba(255,159,28,0.1)',
                color: '#FF9F1C',
                fontSize: '0.65rem',
                border: '1px solid rgba(255,159,28,0.2)',
              }}
            />
          ))}
        </Stack>
      </Box>
    </Card>
  );
}

function RestaurantCard({ restaurant }) {
  return (
    <Card
      sx={{
        bgcolor: '#1F2937',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
      elevation={0}
    >
      <Box
        sx={{
          height: 140,
          backgroundImage: `url(${restaurant.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          bgcolor: '#1F2937',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Box
          sx={{
            width: '100%',
            p: 1.5,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          }}
        >
          <Chip
            label={restaurant.priceLevel}
            size="small"
            sx={{
              bgcolor: 'rgba(247,37,69,0.8)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        </Box>
      </Box>
      <CardContent sx={{ bgcolor: '#1F2937', p: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="#F8FAFC">
          {restaurant.name}
        </Typography>
        <Typography variant="body2" color="#64748B" mb={1.5}>
          {restaurant.cuisine} · {restaurant.address}
        </Typography>
        {restaurant.website && (
          <Button
            href={restaurant.website}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            endIcon={<OpenInNewIcon sx={{ fontSize: '0.85rem' }} />}
            sx={{
              color: '#F72545',
              fontWeight: 600,
              p: 0,
              minWidth: 0,
              textTransform: 'none',
              '&:hover': { bgcolor: 'transparent', color: '#FF9F1C' },
            }}
          >
            Visit website
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function Matches() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('biteright_user_id');
  const [likedDishes, setLikedDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [swipesRes, restaurantsRes] = await Promise.all([
          userId
            ? fetch(`/api/swipes?userId=${userId}&direction=right`)
            : Promise.resolve({ json: () => [] }),
          fetch(`/api/restaurants/matches${userId ? `?userId=${userId}` : ''}`),
        ]);

        const swipes = await (userId ? swipesRes.json() : Promise.resolve([]));
        const rests = await restaurantsRes.json();

        setLikedDishes(Array.isArray(swipes) ? swipes.map((s) => s.dish) : []);
        setRestaurants(Array.isArray(rests) ? rests : []);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  return (
    <Box sx={{ bgcolor: '#0d0d0d', minHeight: '100vh', px: 2.5, pt: 4, pb: 12 }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#FF9F1C">
          Matches
        </Typography>
        <Typography variant="body2" color="#64748B">
          Dishes you loved and places to try
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress sx={{ color: '#F72545' }} />
        </Box>
      ) : (
        <>
          {/* Liked Dishes */}
          <Box mb={4}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <FavoriteIcon sx={{ color: '#F72545', fontSize: '1rem' }} />
              <Typography variant="subtitle1" fontWeight="bold" color="#F8FAFC">
                Dishes You Liked
              </Typography>
              {likedDishes.length > 0 && (
                <Chip
                  label={likedDishes.length}
                  size="small"
                  sx={{
                    bgcolor: '#F72545',
                    color: '#fff',
                    fontWeight: 700,
                    height: 20,
                    fontSize: '0.7rem',
                  }}
                />
              )}
            </Stack>

            {likedDishes.length === 0 ? (
              <Box
                sx={{
                  bgcolor: '#1F2937',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  border: '1px dashed rgba(255,255,255,0.08)',
                }}
              >
                <Typography variant="body2" color="#64748B" mb={1.5}>
                  No likes yet — start swiping to build your taste profile.
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/swipe')}
                  sx={{
                    bgcolor: '#F72545',
                    '&:hover': { bgcolor: '#d41e38' },
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(247,37,69,0.3)',
                  }}
                >
                  Start Swiping
                </Button>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {likedDishes.map((dish, i) => (
                  <DishCard key={i} dish={dish} />
                ))}
              </Stack>
            )}
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 4 }} />

          {/* Recommended Restaurants */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <RestaurantIcon sx={{ color: '#F4B942', fontSize: '1rem' }} />
              <Typography variant="subtitle1" fontWeight="bold" color="#F8FAFC">
                {likedDishes.length > 0 ? 'Restaurants for You' : 'Recommended Restaurants'}
              </Typography>
            </Stack>

            {restaurants.length === 0 ? (
              <Typography variant="body2" color="#64748B" textAlign="center" mt={2}>
                No restaurants found.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {restaurants.map((r, i) => (
                  <RestaurantCard key={i} restaurant={r} />
                ))}
              </Stack>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
