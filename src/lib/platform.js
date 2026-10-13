const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

export const isIOS =
  /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
export const isAndroid = /Android/i.test(ua);
export const isIOSSafari = isIOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);

export function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

export function haptic(pattern = 10) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* unsupported */
  }
}

export function mapsUrl(restaurant) {
  const query = `${restaurant.name}, ${restaurant.address}`;
  if (isIOS) {
    return `https://maps.apple.com/?q=${encodeURIComponent(restaurant.name)}&address=${encodeURIComponent(restaurant.address)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function telUrl(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, '')}`;
}

export async function shareOrCopy({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled';
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
