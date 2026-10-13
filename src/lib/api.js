const TOKEN_KEY = 'br_token';

function safeStorage(fn, fallback = null) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export const tokenStore = {
  get: () => safeStorage(() => localStorage.getItem(TOKEN_KEY)),
  set: (token) => safeStorage(() => localStorage.setItem(TOKEN_KEY, token)),
  clear: () => safeStorage(() => localStorage.removeItem(TOKEN_KEY)),
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  const headers = { Accept: 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('You’re offline. Check your connection and try again.', 0);
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && token) window.dispatchEvent(new Event('br:unauthorized'));
    throw new ApiError(data?.error || 'Something went wrong. Please try again.', res.status);
  }
  return data;
}
