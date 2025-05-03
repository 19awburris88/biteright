// src/theme.jsx
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#D35400', // Burnt orange
    },
    background: {
      default: '#FFF8F0',
    },
    text: {
      primary: '#1A1A1A',
    },
    secondary: {
      main: '#F5B041',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontFamily: 'Playfair Display, serif' },
    h2: { fontFamily: 'Playfair Display, serif' },
    h3: { fontFamily: 'Playfair Display, serif' },
    h4: { fontFamily: 'Playfair Display, serif' },
    h5: { fontFamily: 'Playfair Display, serif' },
    h6: { fontFamily: 'Playfair Display, serif' },
    button: { textTransform: 'none' },
  },
});
