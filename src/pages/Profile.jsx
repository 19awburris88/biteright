import { useCallback, useEffect, useState } from 'react';
import { Box, Button, ButtonBase, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import InstallMobileRoundedIcon from '@mui/icons-material/InstallMobileRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { Page, PageHeader, SectionTitle } from '../components/Page';
import Sheet from '../components/Sheet';
import ConfirmDialog from '../components/ConfirmDialog';
import SignInGate from '../components/SignInGate';
import { Lockup } from '../components/Logo';
import { api } from '../lib/api';
import { shareOrCopy } from '../lib/platform';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useInstall } from '../context/InstallContext';
import { PRICE_OPTIONS, DIET_OPTIONS } from '../lib/options';
import { c, shadow } from '../theme';

function Row({ icon, label, value, onClick, danger, last }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 1.75,
        px: 2,
        py: 1.6,
        textAlign: 'left',
        borderBottom: last ? 'none' : `1px solid ${c.line}`,
        '&:active': { bgcolor: c.raised },
      }}
    >
      <Box sx={{ color: danger ? c.danger : c.teal, display: 'flex', '& svg': { fontSize: 22 } }}>{icon}</Box>
      <Typography sx={{ flex: 1, fontWeight: 650, color: danger ? c.danger : c.text }}>{label}</Typography>
      {value && (
        <Typography sx={{ color: c.muted, fontSize: '0.88rem', maxWidth: '45%', textAlign: 'right' }} noWrap>
          {value}
        </Typography>
      )}
      {!danger && <ChevronRightRoundedIcon sx={{ color: c.faint }} />}
    </ButtonBase>
  );
}

function Group({ title, children }) {
  return (
    <Box sx={{ mb: 3 }}>
      {title && (
        <Typography variant="overline" sx={{ color: c.faint, display: 'block', mb: 1, ml: 0.5 }}>
          {title}
        </Typography>
      )}
      <Box sx={{ borderRadius: 5, bgcolor: c.surface, border: `1px solid ${c.line}`, overflow: 'hidden', boxShadow: shadow.card }}>{children}</Box>
    </Box>
  );
}

function Stat({ value, label }) {
  return (
    <Box sx={{ flex: 1, textAlign: 'center', py: 1.75 }}>
      <Typography sx={{ fontWeight: 800, fontSize: '1.45rem', lineHeight: 1.1 }}>{value ?? '–'}</Typography>
      <Typography sx={{ color: c.muted, fontSize: '0.76rem', fontWeight: 600, mt: 0.25 }}>{label}</Typography>
    </Box>
  );
}

function OptionButton({ selected, onClick, title, subtitle }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        textAlign: 'left',
        p: 2,
        borderRadius: 4,
        bgcolor: selected ? c.peach : c.raised,
        border: `1.5px solid ${selected ? c.brand : 'transparent'}`,
        transition: 'all .15s ease',
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
        {subtitle && <Typography sx={{ color: c.muted, fontSize: '0.85rem' }}>{subtitle}</Typography>}
      </Box>
      <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selected ? c.brand : c.lineStrong}`, display: 'grid', placeItems: 'center' }}>
        {selected && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.brand }} />}
      </Box>
    </ButtonBase>
  );
}

export default function Profile() {
  const { user, updateUser, logout, deleteAccount } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const install = useInstall();
  const [taste, setTaste] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState(null);
  const [categories, setCategories] = useState([]);

  const loadTaste = useCallback(() => {
    api('/taste').then(setTaste).catch(() => setTaste(null));
  }, []);

  useEffect(() => {
    if (user) loadTaste();
  }, [user, loadTaste]);

  useEffect(() => {
    if (sheet === 'cuisines' && !categories.length) api('/dishes/categories').then(setCategories).catch(() => {});
  }, [sheet, categories.length]);

  const shareApp = async () => {
    const r = await shareOrCopy({
      title: 'CraveCompass',
      text: 'Swipe dishes you crave and get matched with Indy restaurants.',
      url: window.location.origin,
    });
    if (r === 'copied') toast('Link copied');
  };

  const installRow = !install.installed && (
    <Row icon={<InstallMobileRoundedIcon />} label="Add to home screen" onClick={install.canPrompt ? install.promptInstall : install.openSheet} />
  );

  if (!user) {
    return (
      <Page>
        <PageHeader eyebrow="Profile" title="Your taste, saved" />
        <SignInGate
          icon={<PersonRoundedIcon />}
          title="Make CraveCompass yours"
          body="Save your taste profile, get ranked matches and keep a list of places to try, on any phone."
        />
        <Box sx={{ mt: 3 }}>
          <Group>
            {installRow}
            <Row icon={<IosShareRoundedIcon />} label="Share CraveCompass" onClick={shareApp} last />
          </Group>
        </Box>
      </Page>
    );
  }

  const open = (name, initial) => {
    setDraft(initial);
    setSheet(name);
  };

  const save = async (patch, message = 'Saved') => {
    setBusy(true);
    try {
      await updateUser(patch);
      setSheet(null);
      toast(message);
    } catch (err) {
      toast(err.message);
    } finally {
      setBusy(false);
    }
  };

  const runConfirm = async () => {
    setBusy(true);
    try {
      if (confirm === 'reset') {
        await api('/swipes', { method: 'DELETE' });
        toast('Taste profile reset. Time to swipe!');
        loadTaste();
      } else if (confirm === 'delete') {
        await deleteAccount();
        navigate('/welcome', { replace: true });
        return;
      } else if (confirm === 'logout') {
        logout();
        navigate('/welcome', { replace: true });
        return;
      }
      setConfirm(null);
    } catch (err) {
      toast(err.message);
    } finally {
      setBusy(false);
    }
  };

  const initials = (user.name || user.email).split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const priceLabel = PRICE_OPTIONS.find((p) => p.value === (user.pricePreference || ''))?.title;
  const dietLabel = user.dietaryTags?.length
    ? user.dietaryTags.map((d) => DIET_OPTIONS.find((o) => o.value === d)?.title).join(', ')
    : 'None';
  const topCats = taste?.categories?.slice(0, 5) || [];
  const maxLikes = Math.max(1, ...topCats.map((t) => t.likes));

  return (
    <Page>
      {/* Identity */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 800,
            fontSize: '1.45rem',
            background: c.brand,
            color: '#fff',
            boxShadow: `0 14px 30px -12px ${c.brandGlow}`,
            flexShrink: 0,
          }}
        >
          {initials}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h3" sx={{ fontSize: '1.8rem', lineHeight: 1.1 }} noWrap>
            {user.name}
          </Typography>
          <Typography sx={{ color: c.muted, fontSize: '0.88rem' }} noWrap>
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', borderRadius: 5, bgcolor: c.surface, border: `1px solid ${c.line}`, mb: 3, '& > *:not(:last-child)': { borderRight: `1px solid ${c.line}` } }}>
        <Stat value={taste?.totalSwipes} label="Swiped" />
        <Stat value={taste?.totalLikes} label="Craved" />
        <Stat value={taste?.savedCount} label="Saved" />
      </Box>

      {/* Taste profile */}
      <Box sx={{ mb: 3.5 }}>
        <SectionTitle
          action={
            taste?.totalLikes > 0 && (
              <Button size="small" onClick={() => navigate('/profile/liked')} sx={{ minHeight: 30, color: c.brand }}>
                Liked dishes
              </Button>
            )
          }
        >
          Taste profile
        </SectionTitle>
        {!taste ? (
          <Skeleton variant="rounded" height={160} sx={{ borderRadius: 5 }} />
        ) : topCats.length === 0 ? (
          <Box sx={{ p: 2.5, borderRadius: 5, bgcolor: c.surface, border: `1px solid ${c.line}` }}>
            <Typography sx={{ color: c.muted, mb: 2 }}>Swipe on a few dishes and your taste profile will take shape here.</Typography>
            <Button variant="contained" onClick={() => navigate('/discover')}>Start swiping</Button>
          </Box>
        ) : (
          <Box sx={{ p: 2.25, borderRadius: 5, bgcolor: c.surface, border: `1px solid ${c.line}` }}>
            <Stack spacing={1.5} sx={{ mb: taste.flavors.length ? 2.5 : 0 }}>
              {topCats.map((cat, i) => (
                <Box key={cat.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>{cat.name}</Typography>
                    <Typography sx={{ color: c.muted, fontSize: '0.82rem', fontWeight: 600 }}>
                      {cat.likes} craved
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, borderRadius: 9, bgcolor: c.raised2, overflow: 'hidden' }}>
                    <Box
                      sx={{
                        height: '100%',
                        width: `${(cat.likes / maxLikes) * 100}%`,
                        borderRadius: 9,
                        background: i === 0 ? c.brand : 'rgba(39,102,95,0.6)',
                        transition: 'width .6s ease',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
            {taste.flavors.length > 0 && (
              <>
                <Typography variant="overline" sx={{ color: c.faint }}>Flavors you love</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.75 }}>
                  {taste.flavors.slice(0, 8).map((f) => (
                    <Box key={f.name} sx={{ px: 1.25, py: 0.4, borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize', bgcolor: c.peach, color: c.brandDeep }}>
                      {f.name}
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>

      <Group title="Preferences">
        <Row icon={<PaymentsRoundedIcon />} label="Price range" value={priceLabel} onClick={() => open('price', user.pricePreference || '')} />
        <Row icon={<SpaRoundedIcon />} label="Dietary" value={dietLabel} onClick={() => open('diet', user.dietaryTags || [])} />
        <Row
          icon={<RestaurantMenuRoundedIcon />}
          label="Favorite cuisines"
          value={user.favoriteCategories?.length ? `${user.favoriteCategories.length} selected` : 'None'}
          onClick={() => open('cuisines', user.favoriteCategories || [])}
        />
        <Row icon={<BadgeRoundedIcon />} label="Name" value={user.name} onClick={() => open('name', user.name || '')} last />
      </Group>

      <Group title="App">
        {installRow}
        <Row icon={<IosShareRoundedIcon />} label="Share CraveCompass" onClick={shareApp} last />
      </Group>

      <Group title="Account">
        <Row icon={<RestartAltRoundedIcon />} label="Reset taste profile" onClick={() => setConfirm('reset')} />
        <Row icon={<LogoutRoundedIcon />} label="Sign out" onClick={() => setConfirm('logout')} />
        <Row icon={<DeleteForeverRoundedIcon />} label="Delete account" onClick={() => setConfirm('delete')} danger last />
      </Group>

      <Box sx={{ textAlign: 'center', mt: 4, opacity: 0.6 }}>
        <Lockup width={150} sx={{ mx: 'auto', mb: 1 }} />
        <Typography sx={{ color: c.faint, fontSize: '0.75rem' }}>CraveCompass 2.0 · Made in Indianapolis</Typography>
      </Box>

      {/* Sheets */}
      <Sheet open={sheet === 'price'} onClose={() => setSheet(null)} title="Price range" subtitle="We’ll favor places at or under this price.">
        <Stack spacing={1}>
          {PRICE_OPTIONS.map((p) => (
            <OptionButton key={p.value} selected={draft === p.value} onClick={() => setDraft(p.value)} title={p.title} subtitle={p.subtitle} />
          ))}
        </Stack>
        <Button fullWidth size="large" variant="contained" disabled={busy} sx={{ mt: 2.5 }} onClick={() => save({ pricePreference: draft })}>
          Save
        </Button>
      </Sheet>

      <Sheet open={sheet === 'diet'} onClose={() => setSheet(null)} title="Dietary" subtitle="Your swipe deck will only show dishes that fit.">
        <Stack spacing={1}>
          {DIET_OPTIONS.map((d) => {
            const on = draft?.includes?.(d.value);
            return (
              <OptionButton
                key={d.value}
                selected={on}
                title={d.title}
                subtitle={d.subtitle}
                onClick={() => setDraft(on ? draft.filter((x) => x !== d.value) : [d.value])}
              />
            );
          })}
          <OptionButton selected={Array.isArray(draft) && draft.length === 0} title="No restrictions" onClick={() => setDraft([])} />
        </Stack>
        <Button fullWidth size="large" variant="contained" disabled={busy} sx={{ mt: 2.5 }} onClick={() => save({ dietaryTags: draft })}>
          Save
        </Button>
      </Sheet>

      <Sheet open={sheet === 'cuisines'} onClose={() => setSheet(null)} title="Favorite cuisines" subtitle="These show up first in your swipe deck.">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: '45dvh', overflowY: 'auto' }}>
          {categories.map((cat) => {
            const on = draft?.includes?.(cat.name);
            return (
              <ButtonBase
                key={cat.name}
                onClick={() => setDraft(on ? draft.filter((x) => x !== cat.name) : [...draft, cat.name])}
                sx={{
                  px: 1.75,
                  height: 40,
                  borderRadius: 999,
                  fontWeight: 700,
                  bgcolor: on ? c.brand : c.raised,
                  color: on ? '#fff' : c.muted,
                  transition: 'all .15s',
                }}
              >
                {cat.name}
              </ButtonBase>
            );
          })}
        </Box>
        <Button fullWidth size="large" variant="contained" disabled={busy} sx={{ mt: 2.5 }} onClick={() => save({ favoriteCategories: draft })}>
          Save
        </Button>
      </Sheet>

      <Sheet open={sheet === 'name'} onClose={() => setSheet(null)} title="Your name">
        <TextField
          fullWidth
          autoFocus
          value={draft || ''}
          onChange={(e) => setDraft(e.target.value)}
          inputProps={{ maxLength: 60, autoComplete: 'name' }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: c.raised } }}
        />
        <Button fullWidth size="large" variant="contained" disabled={busy || !draft?.trim()} sx={{ mt: 2.5 }} onClick={() => save({ name: draft })}>
          Save
        </Button>
      </Sheet>

      <ConfirmDialog
        open={Boolean(confirm)}
        busy={busy}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
        destructive={confirm !== 'logout'}
        title={{ reset: 'Reset your taste profile?', logout: 'Sign out?', delete: 'Delete your account?' }[confirm] || ''}
        body={
          {
            reset: 'This clears every swipe so you can start fresh. Your saved restaurants stay.',
            logout: 'Your taste profile and saved places will be here when you sign back in.',
            delete: 'This permanently deletes your account, swipes and saved restaurants. It can’t be undone.',
          }[confirm] || ''
        }
        confirmLabel={{ reset: 'Reset', logout: 'Sign out', delete: 'Delete forever' }[confirm] || 'OK'}
      />
    </Page>
  );
}
