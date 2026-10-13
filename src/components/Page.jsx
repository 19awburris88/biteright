import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { c } from '../theme';

// Standard tab page: safe-area padding, entrance motion, room for the bottom nav.
export function Page({ children, sx, nav = true }) {
  return (
    <Box
      component={motion.main}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        minHeight: 'var(--app-h)',
        maxWidth: 560,
        mx: 'auto',
        px: 2.5,
        pt: 'calc(var(--safe-top) + 18px)',
        pb: nav ? 'calc(var(--nav-h) + var(--safe-bottom) + 28px)' : 'calc(var(--safe-bottom) + 28px)',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function PageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: 3 }}>
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography variant="overline" sx={{ color: c.brand, display: 'block', mb: 0.25 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h3" sx={{ fontSize: '2.1rem', lineHeight: 1.05 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ color: c.muted, mt: 0.75, fontSize: '0.95rem' }}>{subtitle}</Typography>
        )}
      </Box>
      {right}
    </Box>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
      <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>{children}</Typography>
      {action}
    </Box>
  );
}
