import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import QRCode from 'qrcode';
import { Lockup } from './Logo';
import { c, shadow } from '../theme';

const PREVIEW_PHOTO =
  'https://images.unsplash.com/photo-1664309641932-0e03e0771b97?auto=format&fit=crop&w=700&h=1000&q=80';

// CraveCompass is phone-only. Desktop visitors get a hand-off to their phone.
export default function DesktopGate({ onPreview }) {
  const [qr, setQr] = useState('');
  const url = window.location.origin;

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 1, width: 360, color: { dark: '#202322', light: '#FFFFFF' } })
      .then(setQr)
      .catch(() => {});
  }, [url]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 6,
        background: `radial-gradient(55% 70% at 78% 50%, ${c.peach}, transparent 70%), ${c.bg}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 1040 }}>
        <Box sx={{ flex: 1, minWidth: 340 }}>
          <Lockup width={260} sx={{ mb: 5 }} />
          <Typography variant="h1" sx={{ fontSize: '3.6rem', lineHeight: 1.02, mb: 2.5 }}>
            Made for the
            <br />
            <Box component="span" sx={{ fontStyle: 'italic', color: c.brand }}>
              palm of your hand.
            </Box>
          </Typography>
          <Typography sx={{ color: c.muted, fontSize: '1.15rem', lineHeight: 1.6, mb: 5, maxWidth: 440 }}>
            CraveCompass is a phone app. Scan the code with your iPhone or Android camera, then add it to your home screen.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 4, lineHeight: 0, border: `1px solid ${c.line}`, boxShadow: shadow.card }}>
              {qr ? <img src={qr} width={150} height={150} alt="QR code to open CraveCompass on your phone" /> : <Box sx={{ width: 150, height: 150 }} />}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, mb: 0.5 }}>Scan to open</Typography>
              <Typography sx={{ color: c.muted, fontSize: '0.95rem' }}>{url.replace(/^https?:\/\//, '')}</Typography>
            </Box>
          </Box>
          {onPreview && (
            <Button variant="outlined" onClick={onPreview} sx={{ mt: 4 }}>
              Preview here (dev only)
            </Button>
          )}
        </Box>

        <Box
          sx={{
            width: 300,
            height: 620,
            borderRadius: '48px',
            p: '12px',
            flexShrink: 0,
            background: 'linear-gradient(160deg, #2A2629, #121012)',
            boxShadow: '0 50px 100px -40px rgba(32,35,34,0.55), inset 0 0 0 1.5px rgba(255,255,255,0.12)',
          }}
        >
          <Box sx={{ position: 'relative', height: '100%', borderRadius: '38px', overflow: 'hidden', bgcolor: c.bg }}>
            <Box component="img" src={PREVIEW_PHOTO} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(8,7,8,0.95) 100%)' }} />
            <Box sx={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 90, height: 26, borderRadius: 99, bgcolor: '#000' }} />
            <Box sx={{ position: 'absolute', left: 22, right: 22, bottom: 92 }}>
              <Typography variant="overline" sx={{ color: c.peach }}>Pizza</Typography>
              <Typography variant="h3" sx={{ fontSize: '1.9rem', lineHeight: 1, color: '#fff' }}>Margherita Pizza</Typography>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 2.5 }}>
              <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: '#fff', display: 'grid', placeItems: 'center', color: c.text, fontWeight: 800, fontSize: 22 }}>✕</Box>
              <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: c.brand, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 22, boxShadow: `0 10px 24px -6px ${c.brandGlow}` }}>♥</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
