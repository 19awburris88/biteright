import { useEffect, useState } from 'react';
import { Box, Button, IconButton, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import { Page } from '../components/Page';
import Img from '../components/Img';
import EmptyState from '../components/EmptyState';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { c } from '../theme';

export default function LikedDishes() {
  const navigate = useNavigate();
  const toast = useToast();
  const [items, setItems] = useState(null);

  useEffect(() => {
    api('/swipes?direction=right')
      .then(setItems)
      .catch((err) => {
        toast(err.message);
        setItems([]);
      });
  }, [toast]);

  const remove = async (swipe) => {
    setItems((list) => list.filter((s) => s.id !== swipe.id));
    try {
      await api(`/swipes/${swipe.dishId}`, { method: 'DELETE' });
      toast(`Removed ${swipe.dish.name}`, {
        actionLabel: 'Undo',
        onAction: async () => {
          await api('/swipes', { method: 'POST', body: { dishId: swipe.dishId, swipeDirection: 'right' } });
          setItems((list) => [swipe, ...list]);
        },
      });
    } catch (err) {
      setItems((list) => [swipe, ...list]);
      toast(err.message);
    }
  };

  return (
    <Page>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <IconButton onClick={() => navigate('/profile')} aria-label="Back" sx={{ bgcolor: c.surface, border: `1px solid ${c.line}` }}>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Box>
          <Typography variant="h3" sx={{ fontSize: '1.8rem', lineHeight: 1.1 }}>Dishes you crave</Typography>
          {items?.length > 0 && <Typography sx={{ color: c.muted, fontSize: '0.88rem' }}>Remove any that don’t feel like you anymore.</Typography>}
        </Box>
      </Box>

      {!items && (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" sx={{ aspectRatio: '3/4', height: 'auto', borderRadius: 4 }} />)}
        </Box>
      )}

      {items?.length === 0 && (
        <EmptyState
          icon={<FavoriteBorderRoundedIcon />}
          title="No cravings yet"
          body="Swipe right on dishes you love and they’ll show up here."
          action={<Button variant="contained" onClick={() => navigate('/discover')}>Start swiping</Button>}
        />
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
        <AnimatePresence>
          {items?.map((s) => (
            <motion.div key={s.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <Img src={s.dish.imageUrl} alt={s.dish.name} sx={{ aspectRatio: '3/4', borderRadius: 4 }}>
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(8,7,8,0.92))' }} />
                <IconButton
                  onClick={() => remove(s)}
                  aria-label={`Remove ${s.dish.name}`}
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: c.scrim, backdropFilter: 'blur(8px)', color: c.onImage }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Box sx={{ position: 'absolute', left: 12, right: 12, bottom: 10 }}>
                  <Typography sx={{ color: c.peach, fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.dish.category}</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2, color: c.onImage }}>{s.dish.name}</Typography>
                </Box>
              </Img>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Page>
  );
}
