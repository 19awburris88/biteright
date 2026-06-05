import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F72545',
      dark: '#d41e38',
    },
    secondary: {
      main: '#FF9F1C',
    },
    success: {
      main: '#22C55E',
    },
    background: {
      default: '#0d0d0d',
      paper: '#1F2937',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#64748B',
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
  components: {
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});
