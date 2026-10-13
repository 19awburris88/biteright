import { Dialog, Box, Typography, Button, Stack } from '@mui/material';
import { c } from '../theme';

export default function ConfirmDialog({ open, title, body, confirmLabel, destructive, busy, onConfirm, onClose }) {
  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="xs">
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', mb: 1 }}>{title}</Typography>
        <Typography sx={{ color: c.muted, mb: 3, lineHeight: 1.6 }}>{body}</Typography>
        <Stack direction="row" spacing={1.5}>
          <Button fullWidth variant="outlined" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={onConfirm}
            disabled={busy}
            sx={destructive ? { background: `${c.danger} !important`, boxShadow: 'none !important' } : undefined}
          >
            {confirmLabel}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
