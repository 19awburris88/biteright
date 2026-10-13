import { createTheme } from '@mui/material/styles';

// CraveCompass palette — the single source for color across sx props and CSS.
export const c = {
  // Brand palette
  brand: '#C94B12', // Crave Orange — primary buttons, selected filters, accents
  text: '#202322', // Deep Charcoal — headings, navigation, primary text
  bg: '#FFF8F0', // Warm Cream — page background
  surface: '#FFFFFF', // Clean White — cards, menus, inputs
  peach: '#FBE5D6', // Soft Peach — selected cards, subtle highlights
  teal: '#27665F', // Compass Teal — secondary actions, saved indicators
  muted: '#68625D', // Warm Gray — descriptions, captions
  line: '#E6DACE', // Light Sand — borders, dividers, outlines

  // Derived shades
  brandDeep: '#A83D0D',
  brandGlow: 'rgba(201,75,18,0.28)',
  tealSoft: 'rgba(39,102,95,0.1)',
  raised: '#F8EFE6',
  raised2: '#F0E4D8',
  lineStrong: '#D9C9B8',
  faint: '#958C85',
  onImage: '#FFFFFF',
  scrim: 'rgba(32,35,34,0.45)',
  danger: '#B42318',
};

export const font = {
  body: '"Plus Jakarta Sans Variable", system-ui, -apple-system, sans-serif',
  display: '"Fraunces Variable", Georgia, serif',
};

export const shadow = {
  card: '0 1px 2px rgba(32,35,34,0.04), 0 8px 24px -12px rgba(32,35,34,0.14)',
  lifted: '0 2px 6px rgba(32,35,34,0.06), 0 24px 48px -20px rgba(32,35,34,0.28)',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: c.brand, dark: c.brandDeep, contrastText: '#fff' },
    secondary: { main: c.teal, contrastText: '#fff' },
    success: { main: c.teal },
    error: { main: c.danger },
    background: { default: c.bg, paper: c.surface },
    text: { primary: c.text, secondary: c.muted },
    divider: c.line,
  },
  shape: { borderRadius: 4 }, // sx borderRadius: n → n × 4px
  typography: {
    fontFamily: font.body,
    h1: { fontFamily: font.display, fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontFamily: font.display, fontWeight: 600, letterSpacing: '-0.02em' },
    h3: { fontFamily: font.display, fontWeight: 600, letterSpacing: '-0.015em' },
    h4: { fontFamily: font.display, fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 800, letterSpacing: '-0.01em' },
    h6: { fontWeight: 800, letterSpacing: '-0.005em' },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: 0 },
    overline: { fontWeight: 800, letterSpacing: '0.14em', fontSize: '0.68rem', lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, minHeight: 48, paddingInline: 22, fontSize: '0.98rem' },
        sizeLarge: { minHeight: 56, fontSize: '1.02rem' },
        containedPrimary: {
          background: c.brand,
          boxShadow: `0 10px 24px -10px ${c.brandGlow}, inset 0 1px 0 rgba(255,255,255,0.16)`,
          '&:hover': { background: c.brandDeep },
          '&.Mui-disabled': { background: '#E9C9B6', color: 'rgba(255,255,255,0.9)' },
        },
        outlined: {
          borderColor: c.lineStrong,
          color: c.text,
          background: c.surface,
          '&:hover': { borderColor: c.muted, background: c.surface },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 999, fontWeight: 600 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiDrawer: {
      styleOverrides: {
        paperAnchorBottom: {
          background: c.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          maxWidth: 560,
          marginInline: 'auto',
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -20px 60px -20px rgba(32,35,34,0.3)',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: { root: { backgroundColor: 'rgba(32,35,34,0.42)' }, invisible: { backgroundColor: 'transparent' } },
    },
    MuiDialog: {
      styleOverrides: { paper: { background: c.surface, borderRadius: 24, boxShadow: shadow.lifted } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: c.surface,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: c.line },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: c.lineStrong },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: c.brand, borderWidth: 1.5 },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { '&.Mui-focused': { color: c.brand } } } },
    MuiSkeleton: { styleOverrides: { root: { backgroundColor: c.raised2 } } },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          background: c.text,
          color: '#fff',
          borderRadius: 16,
          fontWeight: 600,
          boxShadow: '0 18px 40px -12px rgba(32,35,34,0.45)',
        },
      },
    },
  },
});
