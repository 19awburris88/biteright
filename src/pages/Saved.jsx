import { useCallback, useEffect, useState } from 'react';
import { Button, Skeleton, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import { Page, PageHeader } from '../components/Page';
import { RestaurantRow } from '../components/restaurant';
import SignInGate from '../components/SignInGate';
import EmptyState from '../components/EmptyState';
import { api } from '../lib/api';
import { cachedLocation, milesBetween, formatMiles } from '../lib/geo';
import { useAuth } from '../context/AuthContext';

export default function Saved() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const location = cachedLocation();

  const load = useCallback(() => {
    setError(null);
    api('/restaurants/saved').then(setItems).catch(setError);
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  if (!user) {
    return (
      <Page>
        <PageHeader eyebrow="Saved" title="Your shortlist" />
        <SignInGate
          icon={<BookmarkRoundedIcon />}
          title="Keep a list of places to try"
          body="Save restaurants you’re excited about and find them here whenever you’re hungry."
        />
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Saved"
        title="Your shortlist"
        subtitle={items?.length ? `${items.length} place${items.length === 1 ? '' : 's'} to try` : undefined}
      />

      {error && (
        <EmptyState
          icon={<CloudOffRoundedIcon />}
          title="Couldn’t load your list"
          body={error.message}
          action={<Button variant="contained" onClick={load}>Try again</Button>}
        />
      )}

      {!error && !items && (
        <Stack spacing={1.25}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={114} sx={{ borderRadius: 5 }} />
          ))}
        </Stack>
      )}

      {items?.length === 0 && (
        <EmptyState
          icon={<BookmarkBorderRoundedIcon />}
          title="Nothing saved yet"
          body="Tap the bookmark on any restaurant to keep it here."
          action={<Button variant="contained" onClick={() => navigate('/matches')}>Browse matches</Button>}
        />
      )}

      {items?.length > 0 && (
        <Stack spacing={1.25}>
          {items.map((r) => (
            <RestaurantRow
              key={r.id}
              restaurant={r}
              showMatch={false}
              distance={formatMiles(milesBetween(location, r))}
              onSaveChange={(saved) => !saved && setItems((list) => list.filter((x) => x.id !== r.id))}
            />
          ))}
        </Stack>
      )}
    </Page>
  );
}
