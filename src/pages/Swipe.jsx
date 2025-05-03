import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material';
import { useSwipeable } from 'react-swipeable';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { motion } from 'framer-motion';

export default function Swipe() {
  const [dishes, setDishes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  useEffect(() => {
    async function fetchDishes() {
      try {
        const res = await fetch('/api/dishes/random');
        const data = await res.json();
        setDishes(data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    }
    fetchDishes();
  }, []);

  const filteredDishes = selectedCuisine
    ? dishes.filter((dish) => dish.category === selectedCuisine)
    : dishes;

  const handleSwipe = (direction) => {
    setAnimationClass(`swipe-${direction}`);
    setTimeout(() => {
      setAnimationClass('');
      setCurrentIndex((prev) => prev + 1);
    }, 400);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: true,
  });

  if (filteredDishes.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h5" color="white">Loading dishes...</Typography>
      </Box>
    );
  }

  if (currentIndex >= filteredDishes.length) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h5" color="white">You're all caught up!</Typography>
      </Box>
    );
  }

  const dish = filteredDishes[currentIndex];

  return (
    <Box
      {...handlers}
      sx={{
        bgcolor: '#0d0d0d',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 6,
        pb: 10,
        px: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="#F5B041" gutterBottom>
        BiteRight
      </Typography>
      <Typography variant="subtitle1" color="#fefefe" mb={3}>
        Swipe to find your restaurant match
      </Typography>

      <TextField
        select
        label="Filter by Cuisine"
        value={selectedCuisine}
        onChange={(e) => {
          setSelectedCuisine(e.target.value);
          setCurrentIndex(0);
        }}
        sx={{ mb: 2, width: '100%', maxWidth: 400, bgcolor: '#fff', borderRadius: 2 }}
      >
        <MenuItem value="">All</MenuItem>
        {[...new Set(dishes.map((d) => d.category))].map((cuisine, i) => (
          <MenuItem key={i} value={cuisine}>{cuisine}</MenuItem>
        ))}
      </TextField>

      <motion.div
        key={dish.id || dish.name}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%' }}
      >
        <Card
          className={`swipe-card ${animationClass}`}
          sx={{ width: '100%', maxWidth: 400, borderRadius: 3, overflow: 'hidden', mb: 3 }}
        >
          <CardMedia
            component="img"
            image={dish.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={dish.name}
            sx={{ height: 240, width: '100%', objectFit: 'cover' }}
          />
          <CardContent sx={{ bgcolor: '#fffaf6', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {dish.name}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" mt={1} flexWrap="wrap">
              {dish.flavorTags.map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  size="small"
                  sx={{ bgcolor: '#D5C4A1', fontWeight: 500 }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </motion.div>

      <Stack direction="row" spacing={5}>
        <IconButton
          onClick={() => handleSwipe('left')}
          sx={{ bgcolor: '#fff', width: 64, height: 64 }}
        >
          <CloseIcon fontSize="large" sx={{ color: '#D35400' }} />
        </IconButton>
        <IconButton
          onClick={() => handleSwipe('right')}
          sx={{ bgcolor: '#D35400', width: 64, height: 64 }}
        >
          <FavoriteIcon fontSize="large" sx={{ color: '#fff' }} />
        </IconButton>
      </Stack>
    </Box>
  );
}