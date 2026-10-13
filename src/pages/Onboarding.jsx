import { useEffect, useState } from 'react';
import { Box, Button, ButtonBase, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Img from '../components/Img';
import { api } from '../lib/api';
import { PRICE_OPTIONS, DIET_OPTIONS } from '../lib/options';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { c } from '../theme';

const STEPS = ['cuisines', 'price', 'diet'];

function Choice({ selected, onClick, title, subtitle }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        textAlign: 'left',
        p: 2.25,
        borderRadius: 5,
        bgcolor: selected ? c.peach : c.surface,
        border: `1.5px solid ${selected ? c.brand : c.line}`,
        transition: 'all .15s',
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>{title}</Typography>
        {subtitle && <Typography sx={{ color: c.muted, fontSize: '0.88rem' }}>{subtitle}</Typography>}
      </Box>
      <Box sx={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: selected ? c.brand : 'transparent', border: selected ? 'none' : `2px solid ${c.lineStrong}` }}>
        {selected && <CheckRoundedIcon sx={{ fontSize: 17, color: '#fff' }} />}
      </Box>
    </ButtonBase>
  );
}

export default function Onboarding() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState(user?.favoriteCategories || []);
  const [price, setPrice] = useState(user?.pricePreference || '');
  const [diet, setDiet] = useState(user?.dietaryTags || []);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/dishes/categories').then(setCategories).catch(() => {});
  }, []);

  const finish = async (skip = false) => {
    setBusy(true);
    try {
      await updateUser(skip ? { onboarded: true } : { favoriteCategories: favorites, pricePreference: price, dietaryTags: diet, onboarded: true });
      navigate('/discover', { replace: true });
    } catch (err) {
      toast(err.message);
      setBusy(false);
    }
  };

  const next = () => (step < STEPS.length - 1 ? setStep(step + 1) : finish());
  const current = STEPS[step];
  const canContinue = current !== 'cuisines' || favorites.length >= 3;

  const titles = {
    cuisines: ['What are you', 'craving?', 'Pick at least 3. They’ll lead your swipe deck.'],
    price: ['What’s your', 'price range?', 'We’ll favor places that fit.'],
    diet: ['Any dietary', 'needs?', 'We’ll only show dishes that work for you.'],
  }[current];

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', minHeight: 'var(--app-h)', display: 'flex', flexDirection: 'column', pt: 'calc(var(--safe-top) + 16px)' }}>
      <Box sx={{ px: 2.5, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1, display: 'flex', gap: 0.75 }}>
          {STEPS.map((s, i) => (
            <Box key={s} sx={{ flex: 1, height: 5, borderRadius: 9, bgcolor: i <= step ? c.brand : c.raised2, transition: 'background-color .3s' }} />
          ))}
        </Box>
        <Button onClick={() => finish(true)} disabled={busy} sx={{ color: c.muted, minHeight: 36, px: 1.5 }}>
          Skip
        </Button>
      </Box>

      <AnimatePresence mode="wait">
        <Box
          key={current}
          component={motion.div}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          sx={{ flex: 1, px: 2.5, pb: 16 }}
        >
          <Typography variant="h2" sx={{ fontSize: '2.3rem', lineHeight: 1.05, mb: 1 }}>
            {titles[0]}{' '}
            <Box component="span" sx={{ fontStyle: 'italic', color: c.brand }}>{titles[1]}</Box>
          </Typography>
          <Typography sx={{ color: c.muted, mb: 3 }}>{titles[2]}</Typography>

          {current === 'cuisines' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {categories.map((cat) => {
                const on = favorites.includes(cat.name);
                return (
                  <ButtonBase
                    key={cat.name}
                    onClick={() => setFavorites(on ? favorites.filter((x) => x !== cat.name) : [...favorites, cat.name])}
                    sx={{ display: 'block', borderRadius: 4, overflow: 'hidden', outline: on ? `2.5px solid ${c.brand}` : 'none', outlineOffset: -2.5 }}
                    aria-pressed={on}
                  >
                    <Img src={cat.imageUrl?.replace(/w=\d+&h=\d+/, 'w=300&h=360')} sx={{ aspectRatio: '5/6' }}>
                      <Box sx={{ position: 'absolute', inset: 0, background: on ? 'linear-gradient(180deg, rgba(201,75,18,0.3), rgba(32,35,34,0.85))' : 'linear-gradient(180deg, transparent 40%, rgba(8,7,8,0.88))' }} />
                      {on && (
                        <Box sx={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: '50%', bgcolor: c.brand, display: 'grid', placeItems: 'center' }}>
                          <CheckRoundedIcon sx={{ fontSize: 16, color: '#fff' }} />
                        </Box>
                      )}
                      <Typography sx={{ position: 'absolute', left: 10, bottom: 8, fontWeight: 800, fontSize: '0.88rem', color: c.onImage }}>{cat.name}</Typography>
                    </Img>
                  </ButtonBase>
                );
              })}
            </Box>
          )}

          {current === 'price' && (
            <Stack spacing={1.25}>
              {PRICE_OPTIONS.map((p) => (
                <Choice key={p.value} selected={price === p.value} onClick={() => setPrice(p.value)} title={p.title} subtitle={p.subtitle} />
              ))}
            </Stack>
          )}

          {current === 'diet' && (
            <Stack spacing={1.25}>
              <Choice selected={diet.length === 0} onClick={() => setDiet([])} title="No restrictions" subtitle="I eat it all" />
              {DIET_OPTIONS.map((d) => (
                <Choice key={d.value} selected={diet.includes(d.value)} onClick={() => setDiet([d.value])} title={d.title} subtitle={d.subtitle} />
              ))}
            </Stack>
          )}
        </Box>
      </AnimatePresence>

      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          px: 2.5,
          pt: 3,
          pb: 'calc(var(--safe-bottom) + 20px)',
          background: `linear-gradient(180deg, transparent, ${c.bg} 35%)`,
          maxWidth: 560,
          mx: 'auto',
          display: 'flex',
          gap: 1.25,
        }}
      >
        {step > 0 && (
          <Button size="large" variant="outlined" onClick={() => setStep(step - 1)} sx={{ flex: '0 0 auto' }}>
            Back
          </Button>
        )}
        <Button size="large" variant="contained" fullWidth disabled={!canContinue || busy} onClick={next}>
          {current === 'cuisines' && favorites.length < 3
            ? `Pick ${3 - favorites.length} more`
            : step === STEPS.length - 1
              ? 'Start swiping'
              : 'Continue'}
        </Button>
      </Box>
    </Box>
  );
}
