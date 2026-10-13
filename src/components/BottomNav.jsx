import { Box, ButtonBase, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { c } from '../theme';

const TABS = [
  { to: '/discover', label: 'Discover', Icon: StyleRoundedIcon },
  { to: '/matches', label: 'Matches', Icon: AutoAwesomeRoundedIcon },
  { to: '/saved', label: 'Saved', Icon: BookmarkRoundedIcon },
  { to: '/profile', label: 'Profile', Icon: PersonRoundedIcon },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        pb: 'var(--safe-bottom)',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'saturate(160%) blur(22px)',
        WebkitBackdropFilter: 'saturate(160%) blur(22px)',
        borderTop: `1px solid ${c.line}`,
      }}
    >
      <Box sx={{ display: 'flex', height: 'var(--nav-h)', maxWidth: 560, mx: 'auto' }}>
        {TABS.map(({ to, label, Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <ButtonBase
              key={to}
              onClick={() => navigate(to)}
              aria-current={active ? 'page' : undefined}
              sx={{ flex: 1, flexDirection: 'column', gap: 0.4, borderRadius: 3 }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 30,
                  borderRadius: 999,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: active ? c.peach : 'transparent',
                  transition: 'background-color .25s ease',
                }}
              >
                <Icon sx={{ fontSize: 23, color: active ? c.brand : c.muted, transition: 'color .2s' }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '0.68rem',
                  fontWeight: active ? 800 : 600,
                  color: active ? c.text : c.muted,
                  letterSpacing: '0.01em',
                }}
              >
                {label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
