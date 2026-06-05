import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const accordionSx = {
  bgcolor: '#1F2937',
  borderRadius: '12px !important',
  border: '1px solid rgba(255,255,255,0.06)',
  mb: 1.5,
  '&:before': { display: 'none' },
  '& .MuiAccordionSummary-root': { px: 2, color: '#F8FAFC' },
  '& .MuiAccordionSummary-expandIconWrapper': { color: '#64748B' },
  '& .MuiAccordionDetails-root': { px: 2, pb: 2 },
};

export default function Settings() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('biteright_user_id');
  const userName = localStorage.getItem('biteright_user_name') || 'Guest';
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/user/${userId}`)
      .then((r) => r.json())
      .then(setUser)
      .catch(() => {});
  }, [userId]);

  const handleClearData = () => {
    localStorage.removeItem('biteright_user_id');
    localStorage.removeItem('biteright_user_name');
    navigate('/');
  };

  return (
    <Box sx={{ bgcolor: '#0d0d0d', minHeight: '100vh', px: 2.5, pt: 4, pb: 12 }}>
      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold" color="#FF9F1C">
          Settings
        </Typography>
        <Typography variant="body2" color="#64748B">
          {userId ? `Signed in as ${userName}` : 'Not signed in'}
        </Typography>
      </Box>

      {/* Taste Profile */}
      <Accordion sx={accordionSx} elevation={0} disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <TuneIcon sx={{ color: '#F72545', fontSize: '1.1rem' }} />
            <Typography fontWeight="bold">Your Taste Profile</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {user ? (
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="#64748B" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Price Range
                </Typography>
                <Typography color="#F8FAFC" variant="body2" mt={0.25}>
                  {user.pricePreference || 'Any'}
                </Typography>
              </Box>
              {user.dietaryTags?.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    color="#64748B"
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.8, mb: 1, display: 'block' }}
                  >
                    Dietary Preferences
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.75}>
                    {user.dietaryTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(247,37,69,0.12)',
                          color: '#F72545',
                          border: '1px solid rgba(247,37,69,0.25)',
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              <Button
                size="small"
                variant="text"
                onClick={() => navigate('/profile')}
                sx={{
                  color: '#F72545',
                  fontWeight: 600,
                  p: 0,
                  alignSelf: 'flex-start',
                  textTransform: 'none',
                }}
              >
                Edit preferences →
              </Button>
            </Stack>
          ) : (
            <Typography variant="body2" color="#64748B">
              {userId ? 'Loading...' : 'Sign in to see your taste profile.'}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* About */}
      <Accordion sx={accordionSx} elevation={0} disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <InfoOutlinedIcon sx={{ color: '#FF9F1C', fontSize: '1.1rem' }} />
            <Typography fontWeight="bold">About BiteRight</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="#64748B" lineHeight={1.7}>
            BiteRight helps you discover restaurants you'll love by swiping on dishes you crave.
            Swipe right to like a dish, left to pass — and we'll match you with restaurants that fit your taste.
          </Typography>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 2 }} />
          <Typography variant="caption" color="#64748B">
            Version 1.0 · Indianapolis, IN
          </Typography>
        </AccordionDetails>
      </Accordion>

      {userId && (
        <Box mt={4}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleClearData}
            sx={{
              borderColor: 'rgba(255,255,255,0.1)',
              color: '#64748B',
              borderRadius: 2,
              py: 1.2,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#ff6b6b',
                color: '#ff6b6b',
                bgcolor: 'rgba(255,107,107,0.05)',
              },
            }}
          >
            Clear Data & Sign Out
          </Button>
        </Box>
      )}
    </Box>
  );
}
