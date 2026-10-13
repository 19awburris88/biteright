import { Box, Typography } from '@mui/material';
import { c } from '../theme';

export default function EmptyState({ icon, title, body, action }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 5,
        px: 3,
        borderRadius: 6,
        border: `1px dashed ${c.lineStrong}`,
        bgcolor: c.surface,
      }}
    >
      <Box sx={{ color: c.faint, mb: 1.5, '& svg': { fontSize: 40 } }}>{icon}</Box>
      <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', mb: 0.75 }}>{title}</Typography>
      <Typography sx={{ color: c.muted, mb: action ? 2.5 : 0, lineHeight: 1.6 }}>{body}</Typography>
      {action}
    </Box>
  );
}
