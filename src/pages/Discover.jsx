import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, ButtonBase, IconButton, Skeleton, Typography } from '@mui/material';
import { useMotionValue, motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import SwipeCard from '../components/SwipeCard';
import Sheet from '../components/Sheet';
import { Wordmark } from '../components/Logo';
import { api } from '../lib/api';
import { guestSwipes } from '../lib/guest';
import { haptic } from '../lib/platform';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useInstall } from '../context/InstallContext';
import { c, shadow } from '../theme';

const UNLOCK_AT = 3;
const NUDGE_KEY = 'br_install_nudged';

function preload(urls) {
  urls.forEach((u) => {
    if (!u) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = u;
  });
}

function ActionButton({ onClick, label, size, children, variant, disabled }) {
  const styles = {
    pass: { bgcolor: c.surface, color: c.text, border: `1.5px solid ${c.line}`, boxShadow: shadow.card },
    like: {
      bgcolor: c.brand,
      color: '#fff',
      boxShadow: `0 16px 30px -10px ${c.brandGlow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
    },
    small: { bgcolor: c.surface, color: c.teal, border: `1.5px solid ${c.line}`, boxShadow: shadow.card },
  }[variant];
  return (
    <IconButton
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      sx={{
        width: size,
        height: size,
        transition: 'transform .15s ease',
        '&:active': { transform: 'scale(0.9)' },
        '&.Mui-disabled': { opacity: 0.35, color: styles.color },
        ...styles,
        '&:hover': styles,
      }}
    >
      {children}
    </IconButton>
  );
}

export default function Discover() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const install = useInstall();

  const [deck, setDeck] = useState([]);
  const [status, setStatus] = useState('loading');
  const [category, setCategory] = useState('');
  const [likes, setLikes] = useState(0);
  const [history, setHistory] = useState([]);
  const [unlockedOpen, setUnlockedOpen] = useState(false);
  const [sessionSwipes, setSessionSwipes] = useState(0);

  const progress = useMotionValue(0);
  const topCard = useRef(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [{ dishes }, taste] = await Promise.all([
        api('/dishes/deck'),
        user ? api('/taste') : Promise.resolve(null),
      ]);
      if (user) {
        setDeck(dishes);
        setLikes(taste.totalLikes);
      } else {
        const done = new Set(guestSwipes.all().map((s) => s.dishId));
        setDeck(dishes.filter((d) => !done.has(d.id)));
        setLikes(guestSwipes.likes().length);
      }
      setHistory([]);
      setStatus('ready');
    } catch (err) {
      setStatus(err.status === 0 ? 'offline' : 'error');
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const counts = {};
    deck.forEach((d) => d.category && (counts[d.category] = (counts[d.category] || 0) + 1));
    return Object.keys(counts).sort();
  }, [deck]);

  const visible = useMemo(
    () => (category ? deck.filter((d) => d.category === category) : deck),
    [deck, category]
  );

  useEffect(() => {
    preload(visible.slice(1, 4).map((d) => d.imageUrl));
  }, [visible]);

  useEffect(() => {
    if (category && !categories.includes(category)) setCategory('');
  }, [categories, category]);

  const handleSwiped = useCallback(
    (dish, direction) => {
      setDeck((d) => d.filter((x) => x.id !== dish.id));
      setHistory((h) => [...h.slice(-19), { dish, direction }]);
      setSessionSwipes((n) => n + 1);
      if (direction === 'right') {
        haptic(14);
        setLikes((n) => {
          if (n + 1 === UNLOCK_AT) setTimeout(() => setUnlockedOpen(true), 250);
          return n + 1;
        });
      }

      if (user) {
        api('/swipes', { method: 'POST', body: { dishId: dish.id, swipeDirection: direction } }).catch((err) =>
          toast(err.status === 0 ? 'You’re offline. That swipe wasn’t saved.' : 'Couldn’t save that swipe.')
        );
      } else {
        guestSwipes.add(dish, direction);
      }
    },
    [user, toast]
  );

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    haptic(6);
    setHistory((h) => h.slice(0, -1));
    setDeck((d) => [last.dish, ...d.filter((x) => x.id !== last.dish.id)]);
    if (last.dish.category !== category && category) setCategory('');
    if (last.direction === 'right') setLikes((n) => Math.max(0, n - 1));
    if (user) api(`/swipes/${last.dish.id}`, { method: 'DELETE' }).catch(() => {});
    else guestSwipes.remove(last.dish.id);
  };

  const fling = (direction) => topCard.current?.fling(direction);

  // One gentle install nudge per device, after the user has had a taste.
  useEffect(() => {
    if (sessionSwipes !== 6 || install.installed) return;
    try {
      if (localStorage.getItem(NUDGE_KEY)) return;
      localStorage.setItem(NUDGE_KEY, '1');
    } catch {
      return;
    }
    toast('Add CraveCompass to your home screen for the full app experience.', {
      actionLabel: 'How',
      onAction: install.openSheet,
      duration: 6000,
    });
  }, [sessionSwipes, install, toast]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') fling('right');
      if (e.key === 'ArrowLeft') fling('left');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const resetPasses = async () => {
    try {
      if (user) await api('/swipes?direction=left', { method: 'DELETE' });
      else guestSwipes.all().filter((s) => s.swipeDirection === 'left').forEach((s) => guestSwipes.remove(s.dishId));
      await load();
    } catch (err) {
      toast(err.message);
    }
  };

  const top3 = visible.slice(0, 3);
  const locked = likes < UNLOCK_AT;

  return (
    <Box
      sx={{
        height: 'var(--app-h)',
        maxWidth: 560,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        pt: 'calc(var(--safe-top) + 10px)',
        pb: 'calc(var(--nav-h) + var(--safe-bottom))',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 }}>
        <Wordmark height={30} />
        <ButtonBase
          onClick={() => navigate('/matches')}
          sx={{
            gap: 0.75,
            px: 1.5,
            height: 36,
            borderRadius: 999,
            bgcolor: c.surface,
            border: `1px solid ${c.line}`,
            fontWeight: 800,
            fontSize: '0.85rem',
          }}
          aria-label={`${likes} liked dishes. View matches`}
        >
          <FavoriteRoundedIcon sx={{ fontSize: 16, color: c.brand }} />
          {likes}
          <Box component="span" sx={{ color: c.muted, fontWeight: 600 }}>
            liked
          </Box>
        </ButtonBase>
      </Box>

      {/* Category filter */}
      <Box className="no-scrollbar" sx={{ display: 'flex', gap: 1, overflowX: 'auto', px: 2.5, py: 1.25, flexShrink: 0 }}>
        {['', ...categories].map((cat) => {
          const active = category === cat;
          return (
            <ButtonBase
              key={cat || 'all'}
              onClick={() => setCategory(cat)}
              sx={{
                flexShrink: 0,
                px: 1.75,
                height: 34,
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '0.85rem',
                color: active ? '#fff' : c.muted,
                bgcolor: active ? c.brand : c.surface,
                border: `1px solid ${active ? c.brand : c.line}`,
                transition: 'all .2s ease',
              }}
            >
              {cat || 'For you'}
            </ButtonBase>
          );
        })}
      </Box>

      {/* Unlock progress */}
      <AnimatePresence initial={false}>
        {locked && status === 'ready' && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <Box sx={{ px: 2.5, pb: 1.25, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 0.5, flex: '0 0 84px' }}>
                {Array.from({ length: UNLOCK_AT }).map((_, i) => (
                  <Box key={i} sx={{ flex: 1, height: 5, borderRadius: 9, bgcolor: i < likes ? c.brand : c.raised2, transition: 'background-color .3s' }} />
                ))}
              </Box>
              <Typography sx={{ fontSize: '0.8rem', color: c.muted, fontWeight: 600 }}>
                Crave {UNLOCK_AT - likes} more to unlock your matches
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deck */}
      <Box sx={{ position: 'relative', flex: 1, minHeight: 0, mx: 2, mt: 0.5 }}>
        {status === 'loading' && (
          <Skeleton variant="rounded" animation="wave" sx={{ position: 'absolute', inset: '0 0 26px 0', height: 'auto', borderRadius: '30px' }} />
        )}

        {(status === 'error' || status === 'offline') && (
          <DeckMessage
            icon={<CloudOffRoundedIcon />}
            title={status === 'offline' ? 'You’re offline' : 'Couldn’t load dishes'}
            body={status === 'offline' ? 'Reconnect to keep discovering.' : 'Something went wrong on our end.'}
            primary={{ label: 'Try again', onClick: load }}
          />
        )}

        {status === 'ready' && top3.length === 0 && (
          category ? (
            <DeckMessage
              icon={<RestaurantRoundedIcon />}
              title={`That’s all the ${category}`}
              body="Try another craving, or see what we matched for you."
              primary={{ label: 'Show everything', onClick: () => setCategory('') }}
            />
          ) : (
            <DeckMessage
              icon={<AutoAwesomeRoundedIcon />}
              title="You’ve tasted it all"
              body="Every dish is swiped. Your matches are ready, or give the ones you passed a second look."
              primary={{ label: 'See my matches', onClick: () => navigate('/matches') }}
              secondary={{ label: 'Revisit passed dishes', onClick: resetPasses }}
            />
          )
        )}

        {status === 'ready' &&
          top3
            .map((dish, depth) => (
              <SwipeCard
                key={dish.id}
                ref={depth === 0 ? topCard : undefined}
                dish={dish}
                depth={depth}
                progress={progress}
                onSwiped={handleSwiped}
              />
            ))
            .reverse()}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2.5, py: 1.75, flexShrink: 0 }}>
        <ActionButton variant="small" size={48} label="Undo last swipe" onClick={undo} disabled={!history.length}>
          <ReplayRoundedIcon />
        </ActionButton>
        <ActionButton variant="pass" size={66} label="Pass" onClick={() => fling('left')} disabled={!top3.length}>
          <CloseRoundedIcon sx={{ fontSize: 34 }} />
        </ActionButton>
        <ActionButton variant="like" size={74} label="Crave it" onClick={() => fling('right')} disabled={!top3.length}>
          <FavoriteRoundedIcon sx={{ fontSize: 34 }} />
        </ActionButton>
        <ActionButton variant="small" size={48} label="View matches" onClick={() => navigate('/matches')}>
          <AutoAwesomeRoundedIcon />
        </ActionButton>
      </Box>

      <Sheet open={unlockedOpen} onClose={() => setUnlockedOpen(false)}>
        <Box sx={{ textAlign: 'center', pb: 1 }}>
          <Box
            sx={{
              width: 76,
              height: 76,
              mx: 'auto',
              mb: 2,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: c.brand,
              color: '#fff',
              boxShadow: `0 20px 40px -12px ${c.brandGlow}`,
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 38 }} />
          </Box>
          <Typography variant="h3" sx={{ fontSize: '2rem', mb: 1 }}>
            Matches <Box component="span" sx={{ fontStyle: 'italic', color: c.brand }}>unlocked</Box>
          </Typography>
          <Typography sx={{ color: c.muted, mb: 3, lineHeight: 1.6 }}>
            {user
              ? 'We know enough about your taste to start pairing you with restaurants. The more you swipe, the sharper they get.'
              : 'Create a free account to see the restaurants that fit your taste. Your swipes come with you.'}
          </Typography>
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={() => {
              setUnlockedOpen(false);
              navigate(user ? '/matches' : '/signup');
            }}
          >
            {user ? 'See my matches' : 'Create free account'}
          </Button>
          <Button fullWidth onClick={() => setUnlockedOpen(false)} sx={{ mt: 1, color: c.muted }}>
            Keep swiping
          </Button>
        </Box>
      </Sheet>
    </Box>
  );
}

function DeckMessage({ icon, title, body, primary, secondary }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: '0 0 26px 0',
        borderRadius: '30px',
        border: `1px solid ${c.line}`,
        background: `radial-gradient(100% 70% at 50% 0%, ${c.peach}, transparent 70%), ${c.surface}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Box sx={{ color: c.brand, mb: 2, '& svg': { fontSize: 44 } }}>{icon}</Box>
      <Typography variant="h3" sx={{ fontSize: '1.75rem', mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: c.muted, mb: 3, lineHeight: 1.6, maxWidth: 300 }}>{body}</Typography>
      <Button variant="contained" onClick={primary.onClick} sx={{ minWidth: 220 }}>
        {primary.label}
      </Button>
      {secondary && (
        <Button onClick={secondary.onClick} sx={{ mt: 1, color: c.muted }}>
          {secondary.label}
        </Button>
      )}
    </Box>
  );
}
