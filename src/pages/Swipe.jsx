import { useEffect, useState, useRef } from 'react';
import { Box, Typography, Chip, Stack, IconButton } from '@mui/material';
import { useSwipeable } from 'react-swipeable';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/biteright-looo.png';

export default function Swipe() {
  const [dishes, setDishes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const swipeDirRef = useRef(null);
  const userId = localStorage.getItem('biteright_user_id');

  useEffect(() => {
    async function fetchDishes() {
      try {
        const res = await fetch('/api/dishes/random');
        const data = await res.json();
        setDishes(data);
      } catch (err) {
        console.error('Error fetching dishes:', err);
      }
    }
    fetchDishes();
  }, []);

  const filteredDishes = selectedCuisine
    ? dishes.filter((d) => d.category === selectedCuisine)
    : dishes;

  const cuisines = [...new Set(dishes.map((d) => d.category).filter(Boolean))];

  const recordSwipe = async (dishId, direction) => {
    if (!userId) return;
    try {
      await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          dishId,
          swipeDirection: direction,
        }),
      });
    } catch (err) {
      console.error('Failed to record swipe:', err);
    }
  };

  const handleSwipe = (direction) => {
    if (isAnimating || currentIndex >= filteredDishes.length) return;
    const dish = filteredDishes[currentIndex];
    swipeDirRef.current = direction;
    setIsAnimating(true);
    recordSwipe(dish.id, direction);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      swipeDirRef.current = null;
      setIsAnimating(false);
    }, 320);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: true,
  });

  const dish = filteredDishes[currentIndex];

  return (
    <Box
      sx={{
        bgcolor: '#0d0d0d',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 4,
        pb: 12,
        px: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ width: '100%', maxWidth: 420, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box
          component="img"
          src={logo}
          alt="BiteRight"
          sx={{ height: 32, objectFit: 'contain' }}
        />
        <Typography variant="caption" color="#64748B">
          Swipe to match
        </Typography>
      </Box>

      {/* Cuisine chips */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1,
          mb: 3,
          width: '100%',
          maxWidth: 420,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Chip
          label="All"
          onClick={() => { setSelectedCuisine(''); setCurrentIndex(0); }}
          sx={{
            bgcolor: selectedCuisine === '' ? '#F72545' : 'rgba(255,255,255,0.07)',
            color: '#F8FAFC',
            fontWeight: 600,
            flexShrink: 0,
            border: selectedCuisine === '' ? 'none' : '1px solid rgba(255,255,255,0.12)',
            '&:hover': { bgcolor: selectedCuisine === '' ? '#d41e38' : 'rgba(255,255,255,0.1)' },
          }}
        />
        {cuisines.map((c, i) => (
          <Chip
            key={i}
            label={c}
            onClick={() => { setSelectedCuisine(c); setCurrentIndex(0); }}
            sx={{
              bgcolor: selectedCuisine === c ? '#F72545' : 'rgba(255,255,255,0.07)',
              color: '#F8FAFC',
              fontWeight: 500,
              flexShrink: 0,
              border: selectedCuisine === c ? 'none' : '1px solid rgba(255,255,255,0.12)',
              '&:hover': { bgcolor: selectedCuisine === c ? '#d41e38' : 'rgba(255,255,255,0.1)' },
            }}
          />
        ))}
      </Box>

      {/* Card area */}
      <Box
        {...handlers}
        sx={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {dishes.length === 0 ? (
          <Typography color="#64748B" mt={10}>Loading dishes...</Typography>
        ) : currentIndex >= filteredDishes.length ? (
          <Box textAlign="center" mt={10}>
            <Typography variant="h6" color="#F8FAFC" mb={1}>You're all caught up!</Typography>
            <Typography variant="body2" color="#64748B">Check your matches or try a different filter.</Typography>
          </Box>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, scale: 0.93, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                x: swipeDirRef.current === 'right' ? 300 : -300,
                opacity: 0,
                rotate: swipeDirRef.current === 'right' ? 12 : -12,
              }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{ width: '100%' }}
            >
              <Box
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                  bgcolor: '#1F2937',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    height: 400,
                    backgroundImage: `url(${dish.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    bgcolor: '#1F2937',
                  }}
                />
                {/* Gradient overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '65%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
                  }}
                />
                {/* Text */}
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#FF9F1C',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 1.2,
                      fontSize: '0.68rem',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    {dish.category}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#F8FAFC" mb={1}>
                    {dish.name}
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                    {dish.flavorTags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(247,37,69,0.7)',
                          color: '#F8FAFC',
                          fontWeight: 500,
                          fontSize: '0.68rem',
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
        )}
      </Box>

      {/* Action buttons */}
      {dish && currentIndex < filteredDishes.length && (
        <Stack direction="row" spacing={5} mt={3} alignItems="center">
          <Box textAlign="center">
            <IconButton
              onClick={() => handleSwipe('left')}
              disabled={isAnimating}
              sx={{
                bgcolor: 'rgba(255,255,255,0.06)',
                border: '2px solid rgba(255,255,255,0.1)',
                width: 60,
                height: 60,
                '&:hover': { bgcolor: 'rgba(255,107,107,0.12)', borderColor: '#ff6b6b' },
              }}
            >
              <CloseIcon fontSize="large" sx={{ color: '#ff6b6b' }} />
            </IconButton>
            <Typography variant="caption" color="#64748B" display="block" mt={0.5}>
              Pass
            </Typography>
          </Box>

          <Box textAlign="center">
            <IconButton
              onClick={() => handleSwipe('right')}
              disabled={isAnimating}
              sx={{
                bgcolor: '#F72545',
                width: 68,
                height: 68,
                boxShadow: '0 4px 24px rgba(247,37,69,0.5)',
                '&:hover': { bgcolor: '#d41e38' },
              }}
            >
              <FavoriteIcon fontSize="large" sx={{ color: '#fff' }} />
            </IconButton>
            <Typography variant="caption" color="#FFD166" display="block" mt={0.5} fontWeight="bold">
              Like
            </Typography>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
