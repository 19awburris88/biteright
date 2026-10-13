import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useMotionValue, useTransform, animate, useMotionValueEvent } from 'framer-motion';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import Img from './Img';
import { c, shadow } from '../theme';

const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 650;

const DIET_LABEL = { vegan: 'Vegan', vegetarian: 'Vegetarian', pescatarian: 'Pescatarian' };

function Stamp({ label, color, opacity, side }) {
  return (
    <motion.div
      style={{
        opacity,
        position: 'absolute',
        top: 'calc(28px + 4%)',
        [side]: 22,
        rotate: side === 'left' ? -14 : 14,
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          px: 1.75,
          py: 0.5,
          border: `3.5px solid ${color}`,
          borderRadius: 2.5,
          color,
          fontWeight: 900,
          fontSize: '2rem',
          letterSpacing: '0.06em',
          lineHeight: 1.1,
          bgcolor: 'rgba(255,255,255,0.92)',
          boxShadow: '0 8px 24px -8px rgba(0,0,0,0.35)',
        }}
      >
        {label}
      </Box>
    </motion.div>
  );
}

// One dish card. The top card is draggable; cards beneath grow as the top one moves.
const SwipeCard = forwardRef(function SwipeCard({ dish, depth, progress, onSwiped }, ref) {
  const x = useMotionValue(0);
  const leaving = useRef(false);
  const rotate = useTransform(x, [-260, 0, 260], [-16, 0, 16]);
  const likeOpacity = useTransform(x, [24, 110], [0, 1]);
  const passOpacity = useTransform(x, [-110, -24], [1, 0]);

  // Cards underneath scale up toward the top position while the top card is dragged.
  const baseScale = 1 - depth * 0.05;
  const scale = useTransform(progress, [0, 1], [baseScale, Math.min(1, baseScale + 0.05)]);
  const y = useTransform(progress, [0, 1], [depth * 13, Math.max(0, (depth - 1) * 13)]);

  useMotionValueEvent(x, 'change', (v) => {
    if (depth === 0) progress.set(Math.min(1, Math.abs(v) / 160));
  });

  const flyOut = async (direction, velocity = 0) => {
    if (leaving.current) return;
    leaving.current = true;
    const distance = (window.innerWidth || 400) * 1.35;
    await animate(x, direction === 'right' ? distance : -distance, {
      duration: Math.max(0.18, 0.32 - Math.abs(velocity) / 8000),
      ease: [0.4, 0, 1, 1],
    });
    progress.set(0);
    onSwiped(dish, direction);
  };

  useImperativeHandle(ref, () => ({ fling: (direction) => flyOut(direction) }));

  const isTop = depth === 0;
  const diet = dish.dietary?.find((d) => DIET_LABEL[d]);

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragSnapToOrigin={false}
      dragElastic={0.9}
      dragMomentum={false}
      onDragEnd={(_e, info) => {
        if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) flyOut('right', info.velocity.x);
        else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) flyOut('left', info.velocity.x);
        else animate(x, 0, { type: 'spring', stiffness: 520, damping: 32 });
      }}
      initial={false}
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale: isTop ? 1 : scale,
        y: isTop ? 0 : y,
        zIndex: 10 - depth,
        position: 'absolute',
        inset: '0 0 26px 0', // leaves room for the cards beneath to peek out
        touchAction: 'pan-y',
        cursor: isTop ? 'grab' : 'default',
        transformOrigin: '50% 90%',
      }}
      whileTap={isTop ? { cursor: 'grabbing' } : undefined}
      aria-hidden={!isTop}
    >
      <Img
        src={dish.imageUrl}
        alt={dish.name}
        eager={depth < 2}
        sx={{
          height: '100%',
          borderRadius: '30px',
          boxShadow: isTop ? shadow.lifted : shadow.card,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, transparent 22%, transparent 45%, rgba(8,7,8,0.72) 72%, rgba(8,7,8,0.97) 100%)',
          }}
        />
        {isTop && (
          <>
            <Stamp label="CRAVE" color={c.brand} opacity={likeOpacity} side="left" />
            <Stamp label="PASS" color={c.text} opacity={passOpacity} side="right" />
          </>
        )}
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 3, pb: 3.25 }}>
          <Typography variant="overline" sx={{ color: c.peach, display: 'block', mb: 0.5 }}>
            {dish.category}
          </Typography>
          <Typography
            variant="h2"
            sx={{ fontSize: 'clamp(1.9rem, 8.5vw, 2.5rem)', lineHeight: 1.02, mb: 1.5, color: c.onImage, textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
          >
            {dish.name}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {diet && (
              <Box sx={chipSx({ bgcolor: c.teal, borderColor: c.teal })}>
                <SpaRoundedIcon sx={{ fontSize: 14 }} />
                {DIET_LABEL[diet]}
              </Box>
            )}
            {dish.flavorTags?.map((tag) => (
              <Box key={tag} sx={chipSx()}>
                {tag}
              </Box>
            ))}
          </Box>
        </Box>
      </Img>
    </motion.div>
  );
});

function chipSx(extra = {}) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    px: 1.25,
    py: 0.45,
    borderRadius: 999,
    fontSize: '0.78rem',
    fontWeight: 700,
    textTransform: 'capitalize',
    color: c.onImage,
    bgcolor: 'rgba(255,255,255,0.14)',
    border: '1px solid rgba(255,255,255,0.22)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    ...extra,
  };
}

export default SwipeCard;
