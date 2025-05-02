import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import { useSwipeable } from 'react-swipeable';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';

const sampleDishes = [
  {
    name: 'Birria Tacos',
    category: 'Tacos',
    flavorTags: ['Tacos', 'spicy', 'savory'],
    imageUrl: 'https://via.placeholder.com/400x300?text=Birria+Tacos',
    restaurant: 'Velvet Taco',
    address: '3012 N Henderson Ave',
    price: '$$',
  },
];

export default function Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

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

  if (currentIndex >= sampleDishes.length) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h5" color="white">You're all caught up!</Typography>
      </Box>
    );
  }

  const dish = sampleDishes[currentIndex];

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
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="#F5B041" gutterBottom>
        BiteRight
      </Typography>
      <Typography variant="subtitle1" color="#fefefe" mb={3}>
        Swipe to find your restaurant match
      </Typography>

      <Card
        className={`swipe-card ${animationClass}`}
        sx={{ width: '90%', borderRadius: 3, overflow: 'hidden', mb: 3 }}
      >
        <CardMedia
          component="img"
          image={dish.imageUrl}
          alt={dish.name}
          sx={{ height: 240 }}
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
                sx={{
                  bgcolor: '#D5C4A1',
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

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

      <Box textAlign="center" mt={3}>
        <Typography color="#fff" fontWeight="bold">{dish.restaurant}</Typography>
        <Typography color="#ccc">{dish.address}</Typography>
        <Typography color="#F5B041">{dish.price}</Typography>
      </Box>
    </Box>
  );
}
