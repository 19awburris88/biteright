import { useState } from 'react';
import { Box } from '@mui/material';
import { c } from '../theme';

// Image that fades in over a soft placeholder instead of popping.
export default function Img({ src, alt = '', sx, imgSx, eager = false, children }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: c.raised, ...sx }}>
      {src && (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'scale(1)' : 'scale(1.03)',
            transition: 'opacity .45s ease, transform .6s ease',
            ...imgSx,
          }}
        />
      )}
      {children}
    </Box>
  );
}
