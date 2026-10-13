import { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lockup } from '../components/Logo';
import { api } from '../lib/api';
import { c } from '../theme';

function Column({ photos, duration, offset }) {
  const loop = [...photos, ...photos];
  return (
    <Box sx={{ flex: 1, overflow: 'hidden', mt: offset }}>
      <motion.div
        animate={{ y: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {loop.map((src, i) => (
          <Box
            key={i}
            component="img"
            src={src}
            alt=""
            loading={i < 4 ? 'eager' : 'lazy'}
            sx={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 4, bgcolor: c.surface }}
          />
        ))}
      </motion.div>
    </Box>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    api('/dishes/categories')
      .then((cats) => setPhotos(cats.map((x) => x.imageUrl?.replace(/w=\d+&h=\d+/, 'w=400&h=533')).filter(Boolean)))
      .catch(() => {});
  }, []);

  const cols = [0, 1, 2].map((k) => photos.filter((_, i) => i % 3 === k));

  return (
    <Box sx={{ position: 'relative', height: 'var(--app-h)', overflow: 'hidden', bgcolor: c.bg }}>
      {photos.length > 0 && (
        <Box sx={{ position: 'absolute', inset: '-4% -8% 0', display: 'flex', gap: 1.25, transform: 'rotate(-6deg)', opacity: 0.85 }}>
          <Column photos={cols[0]} duration={46} offset={0} />
          <Column photos={cols[1]} duration={38} offset="-90px" />
          <Column photos={cols[2]} duration={52} offset="-30px" />
        </Box>
      )}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(255,248,240,0.1) 0%, rgba(255,248,240,0) 14%, rgba(255,248,240,0.9) 32%, ${c.bg} 42%)`,
        }}
      />

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          px: 3,
          pb: 'calc(var(--safe-bottom) + 24px)',
          maxWidth: 560,
          mx: 'auto',
        }}
      >
        <Lockup width={210} sx={{ mb: 3 }} />
        <Typography variant="h1" sx={{ fontSize: 'clamp(2.6rem, 12vw, 3.4rem)', lineHeight: 0.98, mb: 2 }}>
          Find your next
          <br />
          <Box component="span" sx={{ fontStyle: 'italic', color: c.brand }}>
            favorite bite.
          </Box>
        </Typography>
        <Typography sx={{ color: c.muted, fontSize: '1.05rem', lineHeight: 1.55, mb: 4, maxWidth: 380 }}>
          Swipe on dishes you crave. We’ll match you with Indianapolis restaurants that fit your taste.
        </Typography>
        <Stack spacing={1.25}>
          <Button size="large" variant="contained" onClick={() => navigate('/signup')}>
            Get started
          </Button>
          <Button size="large" variant="outlined" onClick={() => navigate('/login')}>
            I have an account
          </Button>
          <Button onClick={() => navigate('/discover')} sx={{ color: c.muted, fontWeight: 600 }}>
            Just browsing? Start swiping
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
