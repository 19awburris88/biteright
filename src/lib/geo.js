const KEY = 'br_location';
const MAX_AGE = 30 * 60 * 1000;

export function cachedLocation() {
  try {
    const loc = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    return loc && Date.now() - loc.at < MAX_AGE ? loc : null;
  } catch {
    return null;
  }
}

export function requestLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Location isn’t available on this device.'));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, at: Date.now() };
        try {
          sessionStorage.setItem(KEY, JSON.stringify(loc));
        } catch {
          /* ignore */
        }
        resolve(loc);
      },
      (err) =>
        reject(
          new Error(
            err.code === 1
              ? 'Location permission is off. Enable it in your browser settings to sort by distance.'
              : 'Couldn’t get your location. Try again in a moment.'
          )
        ),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: MAX_AGE }
    );
  });
}

export function milesBetween(a, b) {
  if (!a || b?.lat == null || b?.lng == null) return null;
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatMiles(mi) {
  if (mi == null) return null;
  if (mi < 0.1) return 'Nearby';
  return `${mi < 10 ? mi.toFixed(1) : Math.round(mi)} mi`;
}
