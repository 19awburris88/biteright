import { Box, Drawer, Typography } from '@mui/material';
import { c } from '../theme';

export default function Sheet({ open, onClose, title, subtitle, children }) {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose} disableScrollLock={false}>
      <Box sx={{ px: 3, pt: 1.25, pb: 3 }}>
        <Box sx={{ width: 40, height: 5, borderRadius: 9, bgcolor: c.lineStrong, mx: 'auto', mb: 2.5 }} />
        {title && (
          <Typography variant="h4" sx={{ fontSize: '1.6rem', mb: subtitle ? 0.5 : 2.5 }}>
            {title}
          </Typography>
        )}
        {subtitle && <Typography sx={{ color: c.muted, mb: 2.5 }}>{subtitle}</Typography>}
        {children}
      </Box>
    </Drawer>
  );
}
