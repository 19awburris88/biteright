// src/pages/Landing.jsx

import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: '#0d0d0d',
        minHeight: '100vh',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Typography
        variant="h2"
        fontWeight="bold"
        color="#F5B041"
        gutterBottom
        sx={{ fontFamily: 'Playfair Display, serif' }}
      >
        BiteRight
      </Typography>

      <Typography variant="h6" color="#ccc" mb={4}>
        Discover restaurants you'll love<br /> by swiping dishes you crave.
      </Typography>

      <Stack spacing={2} width="100%">
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            bgcolor: '#D35400',
            '&:hover': { bgcolor: '#ba4a00' },
            fontWeight: 'bold',
          }}
          onClick={() => navigate('/onboarding')}
        >
          Get Started
        </Button>
      </Stack>
    </Box>
  );
}
