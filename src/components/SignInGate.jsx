import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { c } from '../theme';

export default function SignInGate({ icon, title, body }) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        mt: 2,
        p: 3.5,
        borderRadius: 6,
        textAlign: 'center',
        background: `radial-gradient(120% 90% at 50% 0%, ${c.peach}, transparent 65%), ${c.surface}`,
        border: `1px solid ${c.line}`,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          mx: 'auto',
          mb: 2,
          display: 'grid',
          placeItems: 'center',
          bgcolor: c.peach,
          color: c.brand,
          '& svg': { fontSize: 30 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" sx={{ fontSize: '1.55rem', mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: c.muted, mb: 3, lineHeight: 1.6 }}>{body}</Typography>
      <Stack spacing={1.25}>
        <Button variant="contained" size="large" onClick={() => navigate('/signup')}>
          Create free account
        </Button>
        <Button variant="text" onClick={() => navigate('/login')} sx={{ color: c.muted }}>
          I already have an account
        </Button>
      </Stack>
    </Box>
  );
}
