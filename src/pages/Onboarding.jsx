// src/pages/Onboarding.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';

export default function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Box p={3} sx={{ maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Welcome to BiteRight
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/swipe')}
        >
          Get Started
        </Button>
      </Stack>
    </Box>
  );
}
