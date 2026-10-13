import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { InstallProvider } from './context/InstallContext';
import BottomNav from './components/BottomNav';
import InstallSheet from './components/InstallSheet';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import LikedDishes from './pages/LikedDishes';
import RestaurantDetail from './pages/RestaurantDetail';
import { isStandalone } from './lib/platform';
import { c } from './theme';

const DesktopGate = lazy(() => import('./components/DesktopGate'));

// Phone-only: a wide screen with a mouse gets the hand-off page.
const DESKTOP_QUERY = '(min-width: 900px) and (hover: hover) and (pointer: fine)';

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches && !isStandalone());
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setDesktop(mq.matches && !isStandalone());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return desktop;
}

function Splash() {
  return (
    <Box sx={{ height: 'var(--app-h)', display: 'grid', placeItems: 'center', bgcolor: c.bg }}>
      <CircularProgress size={28} sx={{ color: c.brand }} />
    </Box>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function TabShell() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function GuestOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to={user.onboarded ? '/discover' : '/onboarding'} replace />;
  return children;
}

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/welcome" replace />;
  return <Navigate to={user.onboarded ? '/discover' : '/onboarding'} replace />;
}

function AppRoutes() {
  const { status } = useAuth();
  if (status === 'loading') return <Splash />;

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<GuestOnly><Welcome /></GuestOnly>} />
        <Route path="/signup" element={<GuestOnly><Auth mode="signup" /></GuestOnly>} />
        <Route path="/login" element={<GuestOnly><Auth mode="login" /></GuestOnly>} />
        <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
        <Route element={<TabShell />}>
          <Route path="/discover" element={<Discover />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/liked" element={<RequireAuth><LikedDishes /></RequireAuth>} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <InstallSheet />
    </>
  );
}

const PREVIEW_KEY = 'cc_desktop_preview';

export default function App() {
  const isDesktop = useIsDesktop();
  // Dev-only: lets the team view the phone app on a computer inside a phone-width frame.
  const [preview, setPreview] = useState(() => {
    try {
      return import.meta.env.DEV && sessionStorage.getItem(PREVIEW_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (isDesktop && !preview) {
    const startPreview = () => {
      try {
        sessionStorage.setItem(PREVIEW_KEY, '1');
      } catch {
        /* ignore */
      }
      setPreview(true);
    };
    return (
      <Suspense fallback={<Splash />}>
        <DesktopGate onPreview={import.meta.env.DEV ? startPreview : undefined} />
      </Suspense>
    );
  }

  const app = (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <InstallProvider>
            <AppRoutes />
          </InstallProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  if (!isDesktop) return app;

  // `transform` makes this frame the containing block for fixed elements (bottom nav, etc.).
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: c.raised2, display: 'grid', placeItems: 'center', py: 3 }}>
      <Box
        sx={{
          position: 'relative',
          width: 400,
          height: 'min(860px, calc(100vh - 48px))',
          '--app-h': 'min(860px, calc(100vh - 48px))',
          overflow: 'auto',
          borderRadius: '36px',
          bgcolor: c.bg,
          transform: 'translateZ(0)',
          boxShadow: '0 40px 80px -30px rgba(32,35,34,0.45), 0 0 0 10px #202322',
        }}
      >
        {app}
      </Box>
    </Box>
  );
}
