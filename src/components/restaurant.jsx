import { useState } from 'react';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';
import Img from './Img';
import { api } from '../lib/api';
import { haptic } from '../lib/platform';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { c, shadow } from '../theme';

export function Price({ level, size = '0.85rem', light }) {
  const n = (level || '').length;
  if (!n) return null;
  return (
    <Box component="span" sx={{ fontWeight: 800, fontSize: size, letterSpacing: '0.04em' }} aria-label={`Price ${level}`}>
      <span style={{ color: light ? c.onImage : c.text }}>{'$'.repeat(n)}</span>
      <span style={{ color: light ? 'rgba(255,255,255,0.4)' : c.lineStrong }}>{'$'.repeat(Math.max(0, 3 - n))}</span>
    </Box>
  );
}

export function MatchRing({ score, size = 52, stroke = 4.5, onImage }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
        <defs>
          <linearGradient id="br-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E06A2E" />
            <stop offset="100%" stopColor={c.brandDeep} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill={onImage ? 'rgba(0,0,0,0.4)' : c.surface} stroke={onImage ? 'rgba(255,255,255,0.25)' : c.raised2} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#br-ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - score / 100)}
        />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 800, fontSize: size * 0.3, lineHeight: 1, color: onImage ? c.onImage : c.text }}>
          {score}
          <span style={{ fontSize: '0.6em', opacity: 0.8 }}>%</span>
        </Typography>
      </Box>
    </Box>
  );
}

export function useSaveToggle(restaurant, onChange) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(Boolean(restaurant.saved));
  const [busy, setBusy] = useState(false);

  const toggle = async (e) => {
    e?.stopPropagation();
    if (!user) {
      toast('Create a free account to save restaurants.', { actionLabel: 'Sign up', onAction: () => navigate('/signup') });
      return;
    }
    if (busy) return;
    const next = !saved;
    setSaved(next);
    setBusy(true);
    haptic(next ? 12 : 6);
    try {
      await api(`/restaurants/${restaurant.id}/save`, { method: next ? 'PUT' : 'DELETE' });
      onChange?.(next);
      toast(next ? `Saved ${restaurant.name}` : `Removed from Saved`);
    } catch (err) {
      setSaved(!next);
      toast(err.message);
    } finally {
      setBusy(false);
    }
  };

  return { saved, toggle };
}

export function SaveButton({ restaurant, onChange, variant = 'glass', size = 40 }) {
  const { saved, toggle } = useSaveToggle(restaurant, onChange);
  return (
    <IconButton
      onClick={toggle}
      aria-label={saved ? 'Remove from saved' : 'Save restaurant'}
      aria-pressed={saved}
      sx={{
        width: size,
        height: size,
        ...(variant === 'glass'
          ? {
              color: c.onImage,
              bgcolor: saved ? c.teal : c.scrim,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              '&:hover': { bgcolor: saved ? c.teal : 'rgba(32,35,34,0.6)' },
            }
          : {
              color: saved ? c.teal : c.muted,
              bgcolor: saved ? c.tealSoft : c.surface,
              border: `1px solid ${saved ? 'transparent' : c.line}`,
              '&:hover': { bgcolor: saved ? c.tealSoft : c.raised },
            }),
      }}
    >
      {saved ? <BookmarkRoundedIcon fontSize="small" /> : <BookmarkBorderRoundedIcon fontSize="small" />}
    </IconButton>
  );
}

function Meta({ restaurant, distance, light }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: light ? 'rgba(255,255,255,0.85)' : c.muted, fontSize: '0.82rem', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden' }}>
      {restaurant.priceLevel && (
        <>
          <Price level={restaurant.priceLevel} size="0.8rem" light={light} />
          <span>·</span>
        </>
      )}
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{restaurant.cuisine}</Box>
      {(distance || restaurant.neighborhood) && <span>·</span>}
      {distance ? (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.3 }}>
          <NearMeRoundedIcon sx={{ fontSize: 13 }} />
          {distance}
        </Box>
      ) : (
        restaurant.neighborhood && <span>{restaurant.neighborhood}</span>
      )}
    </Box>
  );
}

const clamp = (lines) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export function reasonText(reasons) {
  if (!reasons?.length) return null;
  const dishes = reasons.flatMap((r) => r.dishes).slice(0, 2);
  if (dishes.length) return `Because you liked ${dishes.join(' & ')}`;
  return `Fits your love of ${reasons.map((r) => r.category).join(' & ')}`;
}

export function TopMatchCard({ restaurant, distance }) {
  const navigate = useNavigate();
  return (
    <ButtonBase
      component="div"
      role="link"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      sx={{ display: 'block', width: '100%', textAlign: 'left', borderRadius: 6, overflow: 'hidden' }}
    >
      <Img src={restaurant.imageUrl} eager sx={{ height: 300, borderRadius: 6 }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 30%, rgba(8,7,8,0.55) 55%, rgba(8,7,8,0.96) 100%)' }} />
        <Box sx={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ px: 1.25, py: 0.5, borderRadius: 999, bgcolor: c.brand, color: '#fff', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', boxShadow: `0 8px 20px -6px ${c.brandGlow}` }}>
            Top match
          </Box>
          <SaveButton restaurant={restaurant} />
        </Box>
        <Box sx={{ position: 'absolute', left: 18, right: 18, bottom: 18, display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h3" sx={{ fontSize: restaurant.name.length > 22 ? '1.5rem' : '1.85rem', lineHeight: 1.05, mb: 0.75, color: c.onImage, ...clamp(2) }}>
              {restaurant.name}
            </Typography>
            <Meta restaurant={restaurant} distance={distance} light />
            {reasonText(restaurant.reasons) && (
              <Typography sx={{ mt: 1, fontSize: '0.84rem', color: c.peach, fontWeight: 700 }}>
                {reasonText(restaurant.reasons)}
              </Typography>
            )}
          </Box>
          <MatchRing score={restaurant.matchScore} size={58} onImage />
        </Box>
      </Img>
    </ButtonBase>
  );
}

export function RestaurantRow({ restaurant, distance, onSaveChange, showMatch = true }) {
  const navigate = useNavigate();
  return (
    <ButtonBase
      component="div"
      role="link"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        gap: 1.75,
        p: 1.25,
        textAlign: 'left',
        borderRadius: 5,
        bgcolor: c.surface,
        border: `1px solid ${c.line}`,
        boxShadow: shadow.card,
        transition: 'transform .15s ease, background-color .2s',
        '&:active': { transform: 'scale(0.985)' },
      }}
    >
      <Img src={restaurant.imageUrl} sx={{ width: 92, height: 92, borderRadius: 3.5, flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0, py: 0.5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.02rem', lineHeight: 1.2, mb: 0.5, ...clamp(2) }}>
          {restaurant.name}
        </Typography>
        <Meta restaurant={restaurant} distance={distance} />
        {showMatch && reasonText(restaurant.reasons) && (
          <Typography sx={{ mt: 0.75, fontSize: '0.78rem', color: c.brand, fontWeight: 700 }} noWrap>
            {reasonText(restaurant.reasons)}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', py: 0.25 }}>
        {showMatch && restaurant.matchScore ? <MatchRing score={restaurant.matchScore} size={44} stroke={4} /> : <span />}
        <SaveButton restaurant={restaurant} variant="solid" size={34} onChange={onSaveChange} />
      </Box>
    </ButtonBase>
  );
}
