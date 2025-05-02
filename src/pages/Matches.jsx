import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
} from '@mui/material';

const mockMatches = [
  {
    name: 'Pecan Lodge',
    cuisine: 'Barbecue',
    address: '2702 Main St, Dallas, TX',
    price: '$$',
    imageUrl: 'https://via.placeholder.com/400x250?text=Pecan+Lodge',
    website: 'https://pecanlodge.com',
  },
  {
    name: 'Uchi Dallas',
    cuisine: 'Japanese (Sushi)',
    address: '2817 Maple Ave, Dallas, TX',
    price: '$$$',
    imageUrl: 'https://via.placeholder.com/400x250?text=Uchi+Dallas',
    website: 'https://uchidallas.com',
  },
];

export default function Matches() {
  return (
    <Box
      sx={{
        bgcolor: '#0d0d0d',
        minHeight: '100vh',
        p: 3,
        pb: 10,
        color: '#fff',
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="#F5B041" gutterBottom>
        Your Matches
      </Typography>

      <Typography variant="body1" mb={3}>
        Based on your taste, here are places you'll love:
      </Typography>

      <Stack spacing={3}>
        {mockMatches.map((match, index) => (
          <Card key={index} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="200"
              image={match.imageUrl}
              alt={match.name}
            />
            <CardContent sx={{ bgcolor: '#fffaf6' }}>
              <Typography variant="h6" fontWeight="bold">{match.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {match.cuisine} · {match.price}
              </Typography>
              <Typography variant="body2" mt={1}>{match.address}</Typography>
              <Button
                href={match.website}
                target="_blank"
                variant="contained"
                sx={{ mt: 2, bgcolor: '#D35400', '&:hover': { bgcolor: '#ba4a00' } }}
              >
                Visit Website
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
