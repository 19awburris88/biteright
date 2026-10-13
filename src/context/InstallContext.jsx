import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isStandalone } from '../lib/platform';

const InstallContext = createContext(null);

// Captures Chrome/Android's install prompt so we can trigger it from our own UI,
// and owns the "how to install" sheet used everywhere.
export function InstallProvider({ children }) {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(isStandalone());
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
      setSheetOpen(false);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return false;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === 'accepted') setInstalled(true);
    return outcome === 'accepted';
  }, [deferred]);

  const value = useMemo(
    () => ({
      installed,
      canPrompt: Boolean(deferred),
      promptInstall,
      sheetOpen,
      openSheet: () => setSheetOpen(true),
      closeSheet: () => setSheetOpen(false),
    }),
    [installed, deferred, promptInstall, sheetOpen]
  );

  return <InstallContext.Provider value={value}>{children}</InstallContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useInstall = () => useContext(InstallContext);
