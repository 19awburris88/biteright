import { useState } from 'react';
import { Box, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { Page } from '../components/Page';
import { Wordmark } from '../components/Logo';
import { guestSwipes } from '../lib/guest';
import { useAuth } from '../context/AuthContext';
import { c } from '../theme';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 4,
    bgcolor: c.surface,
    '& fieldset': { borderColor: c.line },
    '&:hover fieldset': { borderColor: c.lineStrong },
    '&.Mui-focused fieldset': { borderColor: c.brand, borderWidth: 1.5 },
  },
  '& .MuiInputBase-input': { py: 2 },
  '& .MuiInputLabel-root.Mui-focused': { color: c.text },
};

export default function Auth({ mode }) {
  const isSignup = mode === 'signup';
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const guestLikes = guestSwipes.likes().length;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (isSignup && !form.name.trim()) return setError('Please tell us your name.');
    if (isSignup && form.password.length < 8) return setError('Password must be at least 8 characters.');
    setBusy(true);
    try {
      const user = isSignup ? await signup(form) : await login({ email: form.email, password: form.password });
      const dest = location.state?.from || (user.onboarded ? '/discover' : '/onboarding');
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Page nav={false}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <IconButton onClick={() => navigate('/welcome')} aria-label="Back" sx={{ bgcolor: c.surface, border: `1px solid ${c.line}` }}>
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Wordmark height={26} />
        <Box sx={{ width: 40 }} />
      </Box>

      <Typography variant="h2" sx={{ fontSize: '2.4rem', lineHeight: 1.05, mb: 1 }}>
        {isSignup ? (
          <>
            Let’s find your
            <br />
            <Box component="span" sx={{ fontStyle: 'italic', color: c.brand }}>flavor.</Box>
          </>
        ) : (
          <>
            Welcome
            <br />
            <Box component="span" sx={{ fontStyle: 'italic', color: c.brand }}>back.</Box>
          </>
        )}
      </Typography>
      <Typography sx={{ color: c.muted, mb: 4 }}>
        {isSignup
          ? guestLikes
            ? `Your ${guestLikes} craved dish${guestLikes === 1 ? '' : 'es'} will be saved to your new account.`
            : 'Free forever. Takes 20 seconds.'
          : 'Sign in to pick up where you left off.'}
      </Typography>

      <Box component="form" onSubmit={submit} noValidate>
        <Stack spacing={1.75}>
          {isSignup && (
            <TextField
              label="First name"
              value={form.name}
              onChange={set('name')}
              autoComplete="given-name"
              inputProps={{ maxLength: 60, autoCapitalize: 'words' }}
              sx={fieldSx}
            />
          )}
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            inputProps={{ inputMode: 'email', autoCapitalize: 'none', autoCorrect: 'off', spellCheck: false }}
            sx={fieldSx}
          />
          <TextField
            label="Password"
            type={show ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            helperText={isSignup ? 'At least 8 characters' : undefined}
            sx={fieldSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShow((s) => !s)} edge="end" aria-label={show ? 'Hide password' : 'Show password'}>
                      {show ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {error && (
            <Box role="alert" sx={{ px: 2, py: 1.5, borderRadius: 3, bgcolor: '#FDECEA', border: '1px solid #F5C6C0', color: c.danger, fontWeight: 600, fontSize: '0.9rem' }}>
              {error}
            </Box>
          )}

          <Button type="submit" size="large" variant="contained" disabled={busy} sx={{ mt: 1 }}>
            {busy ? <CircularProgress size={22} color="inherit" /> : isSignup ? 'Create account' : 'Sign in'}
          </Button>
        </Stack>
      </Box>

      <Typography sx={{ textAlign: 'center', color: c.muted, mt: 3 }}>
        {isSignup ? 'Already have an account? ' : 'New to CraveCompass? '}
        <Box component={RouterLink} to={isSignup ? '/login' : '/signup'} replace sx={{ color: c.brand, fontWeight: 700, textDecoration: 'none' }}>
          {isSignup ? 'Sign in' : 'Create one'}
        </Box>
      </Typography>
    </Page>
  );
}
