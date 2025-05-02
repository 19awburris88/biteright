import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Button,
} from '@mui/material';

export default function Profile() {
  const [zip, setZip] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');

  const handleSave = () => {
    const userPrefs = {
      zipcode: zip,
      pricePreference: price,
      dietaryTags: tags.split(',').map(tag => tag.trim()),
    };

    // TODO: send to backend with PUT /api/user/preferences
    console.log('Saving preferences:', userPrefs);
  };

  return (
    <Box p={2} sx={{ maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Edit Your Preferences
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="ZIP Code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />

        <TextField
          select
          label="Price Range"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        >
          <MenuItem value="$">$</MenuItem>
          <MenuItem value="$$">$$</MenuItem>
          <MenuItem value="$$$">$$$</MenuItem>
        </TextField>

        <TextField
          label="Dietary Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="vegan, halal, dairy-free"
        />

        <Button variant="contained" onClick={handleSave}>
          Save Preferences
        </Button>
      </Stack>
    </Box>
  );
}
