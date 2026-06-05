import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import logo from '../assets/biteright-looo.png';

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    color: '#F8FAFC',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&.Mui-focused fieldset': { borderColor: '#F72545' },
  },
  '& .MuiInputLabel-root': { color: '#64748B' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#F72545' },
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error('Failed to create account');

      const user = await res.json();
      localStorage.setItem('biteright_user_id', user.id);
      localStorage.setItem('biteright_user_name', user.name);
      navigate('/swipe');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#0d0d0d',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Box
          component="img"
          src={logo}
          alt="BiteRight"
          sx={{ height: 52, mb: 1.5, objectFit: 'contain' }}
        />
        <Typography variant="body2" color="#64748B" mb={4}>
          Tell us a bit about yourself to get started.
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={inputStyle}
          />
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={inputStyle}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              bgcolor: '#F72545',
              '&:hover': { bgcolor: '#d41e38' },
              '&:disabled': { bgcolor: 'rgba(247,37,69,0.3)', color: 'rgba(255,255,255,0.4)' },
              fontWeight: 'bold',
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              boxShadow: '0 4px 20px rgba(247,37,69,0.3)',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Swiping'}
          </Button>

          <Button
            variant="text"
            sx={{ color: '#64748B', fontSize: '0.85rem' }}
            onClick={() => navigate('/swipe')}
          >
            Skip for now
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
