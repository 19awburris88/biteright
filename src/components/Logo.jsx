import { Box } from '@mui/material';
import lockup from '../assets/logo-lockup.png';
import mark from '../assets/logo-mark.png';

// Horizontal lockup (compass mark + wordmark) for headers.
export function Wordmark({ height = 28 }) {
  return <Box component="img" src={lockup} alt="CraveCompass" sx={{ height, width: 'auto', display: 'block' }} />;
}

export function Lockup({ width = 180, sx }) {
  return <Box component="img" src={lockup} alt="CraveCompass" sx={{ width, height: 'auto', display: 'block', ...sx }} />;
}

export function Mark({ size = 40, sx }) {
  return <Box component="img" src={mark} alt="" sx={{ width: size, height: size, display: 'block', ...sx }} />;
}
