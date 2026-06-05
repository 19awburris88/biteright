import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    color: '#F8FAFC',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&.Mui-focused fieldset': { borderColor: '#F72545' },
  },
  '& .MuiInputLabel-root': { color: '#64748B' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#F72545' },
  '& .MuiSelect-icon': { color: '#64748B' },
  '& .MuiMenuItem-root': { color: '#F8FAFC' },
};

const DIETARY_OPTIONS = ['vegan', 'vegetarian', 'halal', 'kosher', 'gluten-free', 'dairy-free', 'nut-free'];

export default function Profile() {
  const userId = localStorage.getItem('biteright_user_id');
  const userName = localStorage.getItem('biteright_user_name') || 'Guest';

  const [price, setPrice] = useState('');
  const [dietaryTags, setDietaryTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/user/${userId}`)
      .then((r) => r.json())
      .then((user) => {
        if (user) {
          setPrice(user.pricePreference || '');
          setDietaryTags(user.dietaryTags || []);
        }
      })
      .catch(() => {});
  }, [userId]);

  const toggleTag = (tag) => {
    setDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricePreference: price, dietaryTags }),
      });
      setSaved(true);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#0d0d0d', minHeight: '100vh', px: 2.5, pt: 4, pb: 12 }}>
      {/* Header */}
      <Box mb={4}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'rgba(247,37,69,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1.5,
          }}
        >
          <PersonIcon sx={{ color: '#F72545', fontSize: '1.6rem' }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" color="#F8FAFC">
          {userName}
        </Typography>
        <Typography variant="body2" color="#64748B">
          {userId ? 'Manage your preferences' : 'Sign in to save your preferences'}
        </Typography>
      </Box>

      <Stack spacing={3}>
        <Box>
          <Typography
            variant="caption"
            color="#64748B"
            fontWeight={600}
            sx={{ textTransform: 'uppercase', letterSpacing: 0.8, mb: 1, display: 'block' }}
          >
            Price Range
          </Typography>
          <TextField
            select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            sx={inputStyle}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="$">$ — Budget-friendly</MenuItem>
            <MenuItem value="$$">$$ — Mid-range</MenuItem>
            <MenuItem value="$$$">$$$ — Upscale</MenuItem>
          </TextField>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="#64748B"
            fontWeight={600}
            sx={{ textTransform: 'uppercase', letterSpacing: 0.8, mb: 1.5, display: 'block' }}
          >
            Dietary Preferences
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {DIETARY_OPTIONS.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => toggleTag(tag)}
                sx={{
                  bgcolor: dietaryTags.includes(tag) ? '#F72545' : 'rgba(255,255,255,0.06)',
                  color: dietaryTags.includes(tag) ? '#fff' : '#64748B',
                  border: dietaryTags.includes(tag)
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.1)',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: dietaryTags.includes(tag)
                      ? '#d41e38'
                      : 'rgba(255,255,255,0.1)',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSave}
          disabled={loading || !userId}
          sx={{
            bgcolor: '#F72545',
            '&:hover': { bgcolor: '#d41e38' },
            '&:disabled': { bgcolor: 'rgba(247,37,69,0.25)', color: 'rgba(255,255,255,0.35)' },
            fontWeight: 'bold',
            py: 1.5,
            borderRadius: 2,
            mt: 1,
            boxShadow: '0 4px 20px rgba(247,37,69,0.3)',
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Save Preferences'}
        </Button>

        {!userId && (
          <Typography variant="body2" color="#64748B" textAlign="center">
            Complete onboarding to save your preferences.
          </Typography>
        )}
      </Stack>

      <Snackbar
        open={saved}
        autoHideDuration={2500}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{
            bgcolor: '#1F2937',
            color: '#F8FAFC',
            border: '1px solid rgba(34,197,94,0.3)',
            '& .MuiAlert-icon': { color: '#22C55E' },
          }}
        >
          Preferences saved!
        </Alert>
      </Snackbar>
    </Box>
  );
}
