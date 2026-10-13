import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from '../lib/api';
import { guestSwipes } from '../lib/guest';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(tokenStore.get() ? 'loading' : 'ready');

  useEffect(() => {
    if (!tokenStore.get()) return;
    api('/auth/me')
      .then(setUser)
      .catch((err) => {
        // Keep the session if we're merely offline; drop it if the token is bad.
        if (err.status === 401) tokenStore.clear();
      })
      .finally(() => setStatus('ready'));
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      tokenStore.clear();
      setUser(null);
    };
    window.addEventListener('br:unauthorized', onUnauthorized);
    return () => window.removeEventListener('br:unauthorized', onUnauthorized);
  }, []);

  const startSession = useCallback(async ({ token, user: nextUser }) => {
    tokenStore.set(token);
    setUser(nextUser);
    const pending = guestSwipes.all();
    if (pending.length) {
      try {
        await api('/swipes/bulk', {
          method: 'POST',
          body: { swipes: pending.map(({ dishId, swipeDirection }) => ({ dishId, swipeDirection })) },
        });
        guestSwipes.clear();
      } catch {
        /* keep them locally and retry next sign-in */
      }
    }
    return nextUser;
  }, []);

  const signup = useCallback(
    (fields) => api('/auth/signup', { method: 'POST', body: fields }).then(startSession),
    [startSession]
  );
  const login = useCallback(
    (fields) => api('/auth/login', { method: 'POST', body: fields }).then(startSession),
    [startSession]
  );
  const updateUser = useCallback(async (patch) => {
    const next = await api('/auth/me', { method: 'PATCH', body: patch });
    setUser(next);
    return next;
  }, []);
  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);
  const deleteAccount = useCallback(async () => {
    await api('/auth/me', { method: 'DELETE' });
    tokenStore.clear();
    guestSwipes.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, status, signup, login, logout, updateUser, deleteAccount }),
    [user, status, signup, login, logout, updateUser, deleteAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
