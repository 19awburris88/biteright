import { Box, Button, Stack, Typography } from '@mui/material';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import InstallMobileRoundedIcon from '@mui/icons-material/InstallMobileRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Sheet from './Sheet';
import { useInstall } from '../context/InstallContext';
import { isIOS, isIOSSafari } from '../lib/platform';
import { c } from '../theme';

function Step({ n, icon, children }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, p: 1.5, borderRadius: 4, bgcolor: c.raised }}>
      <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: c.brand, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
        {n}
      </Box>
      <Typography sx={{ flex: 1, fontWeight: 600, lineHeight: 1.45 }}>{children}</Typography>
      <Box sx={{ color: c.teal, display: 'flex' }}>{icon}</Box>
    </Box>
  );
}

export default function InstallSheet() {
  const { sheetOpen, closeSheet, canPrompt, promptInstall, installed } = useInstall();

  let body;
  if (installed) {
    body = (
      <Stack alignItems="center" spacing={1.5} sx={{ py: 2 }}>
        <CheckCircleRoundedIcon sx={{ fontSize: 48, color: c.teal }} />
        <Typography sx={{ fontWeight: 700 }}>CraveCompass is on your home screen.</Typography>
      </Stack>
    );
  } else if (canPrompt) {
    body = (
      <Button
        fullWidth
        size="large"
        variant="contained"
        startIcon={<InstallMobileRoundedIcon />}
        onClick={promptInstall}
      >
        Install CraveCompass
      </Button>
    );
  } else if (isIOS) {
    body = (
      <Stack spacing={1.25}>
        {!isIOSSafari && (
          <Typography sx={{ color: c.brand, fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>
            Tip: this works best from Safari.
          </Typography>
        )}
        <Step n={1} icon={<IosShareRoundedIcon />}>
          Tap the <b>Share</b> button in your browser’s toolbar
        </Step>
        <Step n={2} icon={<AddBoxOutlinedIcon />}>
          Scroll down and choose <b>Add to Home Screen</b>
        </Step>
        <Step n={3} icon={<CheckCircleRoundedIcon />}>
          Tap <b>Add</b>. CraveCompass opens full screen like any app
        </Step>
      </Stack>
    );
  } else {
    body = (
      <Stack spacing={1.25}>
        <Step n={1} icon={<MoreVertRoundedIcon />}>
          Open your browser menu (<b>⋮</b>)
        </Step>
        <Step n={2} icon={<InstallMobileRoundedIcon />}>
          Tap <b>Install app</b> or <b>Add to Home screen</b>
        </Step>
        <Step n={3} icon={<CheckCircleRoundedIcon />}>
          Confirm. CraveCompass lands on your home screen
        </Step>
      </Stack>
    );
  }

  return (
    <Sheet
      open={sheetOpen}
      onClose={closeSheet}
      title="Get the app"
      subtitle="Add CraveCompass to your home screen for a full-screen, app-like experience. No app store needed."
    >
      {body}
      <Button fullWidth onClick={closeSheet} sx={{ mt: 1.5, color: c.muted }}>
        Not now
      </Button>
    </Sheet>
  );
}
