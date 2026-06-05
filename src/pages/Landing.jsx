import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/biteright-looo.png';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: '#0d0d0d',
        minHeight: '100vh',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="BiteRight"
        sx={{ height: 90, mb: 3, objectFit: 'contain' }}
      />

      <Typography variant="h6" color="#64748B" mb={5} lineHeight={1.6}>
        Discover restaurants you'll love<br />by swiping dishes you crave.
      </Typography>

      <Stack spacing={2} width="100%" maxWidth={360}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => navigate('/onboarding')}
          sx={{
            bgcolor: '#F72545',
            '&:hover': { bgcolor: '#d41e38' },
            fontWeight: 'bold',
            py: 1.6,
            borderRadius: 2,
            fontSize: '1rem',
            boxShadow: '0 4px 20px rgba(247,37,69,0.35)',
          }}
        >
          Get Started
        </Button>
        <Button
          variant="text"
          sx={{ color: '#64748B', fontSize: '0.85rem' }}
          onClick={() => navigate('/swipe')}
        >
          Browse without signing in
        </Button>
      </Stack>
    </Box>
  );
}
