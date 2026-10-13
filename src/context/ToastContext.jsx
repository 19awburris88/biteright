import { createContext, useCallback, useContext, useState } from 'react';
import { Snackbar, Button } from '@mui/material';
import { c } from '../theme';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, options = {}) => {
    setToast({ message, key: Date.now(), ...options });
  }, []);

  const close = (_e, reason) => {
    if (reason !== 'clickaway') setToast(null);
  };

  return (
    <ToastContext.Provider value={show}>
      {children}
      <Snackbar
        key={toast?.key}
        open={Boolean(toast)}
        onClose={close}
        autoHideDuration={toast?.duration ?? 2800}
        message={toast?.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: 'calc(var(--safe-top) + 12px) !important', left: 16, right: 16 }}
        action={
          toast?.actionLabel && (
            <Button
              size="small"
              onClick={() => {
                toast.onAction?.();
                setToast(null);
              }}
              sx={{ color: c.peach, minHeight: 32, fontWeight: 800 }}
            >
              {toast.actionLabel}
            </Button>
          )
        }
      />
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
