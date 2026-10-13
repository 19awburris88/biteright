import { useEffect, useState } from 'react';
import { Box, Button, ButtonBase, IconButton, Skeleton, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import DirectionsRoundedIcon from '@mui/icons-material/DirectionsRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import Img from '../components/Img';
import EmptyState from '../components/EmptyState';
import { MatchRing, Price, SaveButton } from '../components/restaurant';
import { api } from '../lib/api';
import { mapsUrl, telUrl, shareOrCopy } from '../lib/platform';
import { cachedLocation, milesBetween, formatMiles } from '../lib/geo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { c, shadow } from '../theme';

function Action({ icon, label, href, onClick, disabled }) {
  return (
    <ButtonBase
      component={href ? 'a' : 'button'}
      href={href}
      target={href && !href.startsWith('tel:') ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      disabled={disabled}
      sx={{
        flex: 1,
        flexDirection: 'column',
        gap: 0.75,
        py: 1.6,
        borderRadius: 4,
        bgcolor: c.surface,
        border: `1px solid ${c.line}`,
        boxShadow: shadow.card,
        fontWeight: 700,
        fontSize: '0.78rem',
        color: disabled ? c.faint : c.text,
        opacity: disabled ? 0.5 : 1,
        '& svg': { color: disabled ? c.faint : c.teal, fontSize: 24 },
        '&:active': { transform: 'scale(0.96)' },
        transition: 'transform .15s',
      }}
    >
      {icon}
      {label}
    </ButtonBase>
  );
}

const glassBtn = {
  width: 42,
  height: 42,
  color: c.onImage,
  bgcolor: c.scrim,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${c.line}`,
  '&:hover': { bgcolor: 'rgba(32,35,34,0.6)' },
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [r, setR] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setR(null);
    setError(null);
    api(`/restaurants/${id}`).then(setR).catch(setError);
  }, [id]);

  const back = () => (window.history.length > 1 ? navigate(-1) : navigate('/matches'));

  const share = async () => {
    const result = await shareOrCopy({
      title: r.name,
      text: `${r.name}: ${r.cuisine} in Indianapolis. Found on CraveCompass.`,
      url: window.location.href,
    });
    if (result === 'copied') toast('Link copied');
  };

  if (error) {
    return (
      <Box sx={{ p: 2.5, pt: 'calc(var(--safe-top) + 16px)', maxWidth: 560, mx: 'auto' }}>
        <IconButton onClick={back} sx={{ ...glassBtn, mb: 3 }} aria-label="Back">
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>
        <EmptyState
          icon={<PlaceRoundedIcon />}
          title={error.status === 404 ? 'Restaurant not found' : 'Couldn’t load this place'}
          body={error.status === 404 ? 'It may no longer be listed.' : error.message}
          action={<Button variant="contained" onClick={() => navigate('/matches')}>Back to matches</Button>}
        />
      </Box>
    );
  }

  const distance = r ? formatMiles(milesBetween(cachedLocation(), r)) : null;
  const likedDishes = r?.reasons?.flatMap((x) => x.dishes) || [];

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', minHeight: 'var(--app-h)', pb: 'calc(var(--nav-h) + var(--safe-bottom) + 28px)' }}>
      {/* Hero */}
      <Box sx={{ position: 'relative' }}>
        {r ? (
          <Img src={r.imageUrl} eager sx={{ height: 'calc(var(--app-h) * 0.46)', minHeight: 300 }}>
            <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 28%, transparent 55%, ${c.bg} 100%)` }} />
          </Img>
        ) : (
          <Skeleton variant="rectangular" sx={{ height: 'calc(var(--app-h) * 0.46)', minHeight: 300 }} />
        )}
        <Box sx={{ position: 'absolute', top: 'calc(var(--safe-top) + 12px)', left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
          <IconButton onClick={back} sx={glassBtn} aria-label="Back">
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          {r && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={share} sx={glassBtn} aria-label="Share">
                <IosShareRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <SaveButton restaurant={r} size={42} />
            </Box>
          )}
        </Box>
      </Box>

      {r ? (
        <Box component={motion.div} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} sx={{ px: 2.5, mt: -9, position: 'relative' }}>
          <Typography variant="overline" sx={{ color: c.brand }}>
            {r.cuisine}
          </Typography>
          <Typography variant="h2" sx={{ fontSize: r.name.length > 24 ? '1.95rem' : '2.45rem', lineHeight: 1.04, mb: 1.25 }}>
            {r.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: c.muted, fontSize: '0.9rem', flexWrap: 'wrap', mb: 3 }}>
            {[
              r.priceLevel && <Price key="p" level={r.priceLevel} size="0.9rem" />,
              r.neighborhood && <span key="n">{r.neighborhood}</span>,
              distance && <span key="d">{distance} away</span>,
            ]
              .filter(Boolean)
              .flatMap((el, i) => (i ? [<span key={`s${i}`}>·</span>, el] : [el]))}
          </Box>

          {r.matchScore && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                mb: 2.5,
                borderRadius: 5,
                bgcolor: c.peach,
              }}
            >
              <MatchRing score={r.matchScore} size={62} stroke={5} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, mb: 0.25 }}>
                  {r.matchScore >= 85 ? 'An excellent match' : r.matchScore >= 70 ? 'A strong match' : 'A good match'}
                </Typography>
                <Typography sx={{ color: c.muted, fontSize: '0.87rem', lineHeight: 1.5 }}>
                  {likedDishes.length
                    ? <>You craved <b style={{ color: c.text }}>{likedDishes.join(', ')}</b>, and they serve {r.matchedCategories.slice(0, 2).join(' & ')}.</>
                    : `Fits your love of ${r.matchedCategories.slice(0, 2).join(' & ')}.`}
                </Typography>
              </Box>
            </Box>
          )}

          {!user && (
            <ButtonBase
              onClick={() => navigate('/signup')}
              sx={{ width: '100%', justifyContent: 'flex-start', gap: 1.5, p: 2, mb: 2.5, borderRadius: 5, bgcolor: c.surface, border: `1px solid ${c.line}`, textAlign: 'left' }}
            >
              <FavoriteRoundedIcon sx={{ color: c.brand }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Create an account to see how well this matches your taste
              </Typography>
            </ButtonBase>
          )}

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Action icon={<DirectionsRoundedIcon />} label="Directions" href={mapsUrl(r)} />
            <Action icon={<CallRoundedIcon />} label="Call" href={r.phone ? telUrl(r.phone) : undefined} disabled={!r.phone} />
            <Action icon={<LanguageRoundedIcon />} label="Website" href={r.website || undefined} disabled={!r.website} />
          </Box>

          {r.categories?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 800, mb: 1.25 }}>On the menu</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {r.categories.map((cat) => {
                  const hit = r.matchedCategories?.includes(cat);
                  return (
                    <Box
                      key={cat}
                      sx={{
                        px: 1.5,
                        py: 0.6,
                        borderRadius: 999,
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        bgcolor: hit ? c.peach : c.surface,
                        color: hit ? c.brandDeep : c.muted,
                        border: `1px solid ${hit ? c.peach : c.line}`,
                      }}
                    >
                      {cat}
                    </Box>
                  );
                })}
                {r.dietary?.map((d) => (
                  <Box key={d} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.6, borderRadius: 999, fontSize: '0.84rem', fontWeight: 700, color: c.teal, bgcolor: c.tealSoft }}>
                    <SpaRoundedIcon sx={{ fontSize: 15 }} />
                    {d.replace('-friendly', '')}-friendly
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <ButtonBase
            component="a"
            href={mapsUrl(r)}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ width: '100%', justifyContent: 'flex-start', gap: 1.75, p: 2, borderRadius: 5, bgcolor: c.surface, border: `1px solid ${c.line}`, textAlign: 'left' }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: c.peach, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <PlaceRoundedIcon sx={{ color: c.brand }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.address.split(',')[0]}</Typography>
              <Typography sx={{ color: c.muted, fontSize: '0.84rem' }}>
                {r.address.split(',').slice(1).join(',').trim()} {r.zipcode}
              </Typography>
            </Box>
          </ButtonBase>

          <Typography sx={{ color: c.faint, fontSize: '0.75rem', textAlign: 'center', mt: 3 }}>
            Photo is representative of the cuisine. Check hours with the restaurant before you go.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ px: 2.5, mt: 2 }}>
          <Skeleton width="40%"  />
          <Skeleton width="80%" height={56}  />
          <Skeleton width="60%" sx={{ mb: 3 }} />
          <Skeleton variant="rounded" height={96} sx={{ borderRadius: 5 }} />
        </Box>
      )}
    </Box>
  );
}
