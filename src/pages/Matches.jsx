import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, ButtonBase, Skeleton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded';
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import { Page, PageHeader, SectionTitle } from '../components/Page';
import { TopMatchCard, RestaurantRow } from '../components/restaurant';
import SignInGate from '../components/SignInGate';
import EmptyState from '../components/EmptyState';
import { api } from '../lib/api';
import { guestSwipes } from '../lib/guest';
import { cachedLocation, requestLocation, milesBetween, formatMiles } from '../lib/geo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { c, shadow } from '../theme';

const PRICE_FILTERS = ['', '$', '$$', '$$$'];
const TASTE_COLORS = [c.brand, c.teal, '#E9A47E', '#8DB7B1'];

function Pill({ active, onClick, children, icon }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        flexShrink: 0,
        gap: 0.5,
        px: 1.6,
        height: 34,
        borderRadius: 999,
        fontWeight: 700,
        fontSize: '0.84rem',
        color: active ? '#fff' : c.muted,
        bgcolor: active ? c.brand : c.surface,
        border: `1px solid ${active ? c.brand : c.line}`,
        transition: 'all .2s ease',
      }}
    >
      {icon}
      {children}
    </ButtonBase>
  );
}

function TasteStrip({ taste }) {
  const top = taste.categories.slice(0, 4);
  return (
    <Box sx={{ p: 2, mb: 3, borderRadius: 5, bgcolor: c.surface, border: `1px solid ${c.line}`, boxShadow: shadow.card }}>
      <Typography variant="overline" sx={{ color: c.muted }}>
        Your taste right now
      </Typography>
      <Box sx={{ display: 'flex', height: 10, borderRadius: 9, overflow: 'hidden', my: 1.25, bgcolor: c.raised2 }}>
        {top.map((cat, i) => (
          <Box
            key={cat.name}
            sx={{ width: `${cat.share * 100}%`, bgcolor: TASTE_COLORS[i], transition: 'width .5s ease' }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5 }}>
        {top.map((cat, i) => (
          <Box key={cat.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.82rem', fontWeight: 700 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: TASTE_COLORS[i] }} />
            {cat.name}
            <Box component="span" sx={{ color: c.faint }}>{Math.round(cat.share * 100)}%</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function Matches() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState('');
  const [sort, setSort] = useState('match');
  const [location, setLocation] = useState(cachedLocation());
  const [locating, setLocating] = useState(false);

  const load = useCallback(() => {
    setError(null);
    api('/restaurants/matches')
      .then(setData)
      .catch((err) => setError(err));
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const sortNearest = async () => {
    if (sort === 'near') return setSort('match');
    if (location) return setSort('near');
    setLocating(true);
    try {
      setLocation(await requestLocation());
      setSort('near');
    } catch (err) {
      toast(err.message);
    } finally {
      setLocating(false);
    }
  };

  const list = useMemo(() => {
    if (!data?.matches) return [];
    const rows = data.matches
      .filter((r) => !price || r.priceLevel === price)
      .map((r) => ({ ...r, miles: milesBetween(location, r) }));
    if (sort === 'near') rows.sort((a, b) => (a.miles ?? 1e9) - (b.miles ?? 1e9));
    return rows;
  }, [data, price, sort, location]);

  if (!user) {
    const liked = guestSwipes.likes().length;
    return (
      <Page>
        <PageHeader eyebrow="Matches" title="Your matches" />
        <SignInGate
          icon={<AutoAwesomeRoundedIcon />}
          title={liked ? `You’ve craved ${liked} dish${liked === 1 ? '' : 'es'}` : 'Matches made for you'}
          body="Create a free account and we’ll rank Indianapolis restaurants by how well they fit your taste. Your swipes come with you."
        />
      </Page>
    );
  }

  const [first, ...rest] = list;

  return (
    <Page>
      <PageHeader eyebrow="Matches" title="Made for you" subtitle="Indianapolis restaurants ranked by your taste." />

      {error && (
        <EmptyState
          icon={<CloudOffRoundedIcon />}
          title={error.status === 0 ? 'You’re offline' : 'Couldn’t load matches'}
          body={error.message}
          action={<Button variant="contained" onClick={load}>Try again</Button>}
        />
      )}

      {!error && !data && (
        <Stack spacing={1.5}>
          <Skeleton variant="rounded" height={86} sx={{ borderRadius: 5 }} />
          <Skeleton variant="rounded" height={300} sx={{ borderRadius: 6 }} />
          <Skeleton variant="rounded" height={114} sx={{ borderRadius: 5 }} />
        </Stack>
      )}

      {data?.locked && (
        <EmptyState
          icon={<AutoAwesomeRoundedIcon />}
          title={`Crave ${data.likesNeeded} more dish${data.likesNeeded === 1 ? '' : 'es'}`}
          body="Swipe right on a few dishes you love and we’ll start matching you with restaurants."
          action={<Button variant="contained" onClick={() => navigate('/discover')}>Start swiping</Button>}
        />
      )}

      {data && !data.locked && (
        <>
          <TasteStrip taste={data.taste} />

          <Box className="no-scrollbar" sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 2.5, mx: -2.5, px: 2.5 }}>
            <Pill
              active={sort === 'near'}
              onClick={sortNearest}
              icon={<NearMeRoundedIcon sx={{ fontSize: 15 }} />}
            >
              {locating ? 'Locating…' : 'Nearest'}
            </Pill>
            <Box sx={{ width: '1px', bgcolor: c.line, flexShrink: 0, my: 0.5 }} />
            {PRICE_FILTERS.map((p) => (
              <Pill key={p || 'any'} active={price === p} onClick={() => setPrice(p)}>
                {p || 'Any price'}
              </Pill>
            ))}
          </Box>

          {list.length === 0 ? (
            <EmptyState
              icon={<RestaurantRoundedIcon />}
              title="No matches at this price"
              body="Try another price range, or keep swiping to broaden your taste."
              action={<Button variant="outlined" onClick={() => setPrice('')}>Show all prices</Button>}
            />
          ) : (
            <>
              <TopMatchCard restaurant={first} distance={formatMiles(first.miles)} />
              {rest.length > 0 && (
                <Box sx={{ mt: 3.5 }}>
                  <SectionTitle>
                    {sort === 'near' ? 'Closest to you' : 'More great fits'}{' '}
                    <Box component="span" sx={{ color: c.faint, fontWeight: 700 }}>{rest.length}</Box>
                  </SectionTitle>
                  <Stack spacing={1.25}>
                    {rest.map((r) => (
                      <RestaurantRow key={r.id} restaurant={r} distance={formatMiles(r.miles)} />
                    ))}
                  </Stack>
                </Box>
              )}
            </>
          )}

          <Typography sx={{ color: c.faint, fontSize: '0.75rem', textAlign: 'center', mt: 4 }}>
            Photos are representative of each restaurant’s cuisine.
          </Typography>
        </>
      )}
    </Page>
  );
}
