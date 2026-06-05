import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Swipe from './pages/Swipe';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';

const HIDE_NAV_ROUTES = ['/', '/onboarding'];

function AppShell() {
  const location = useLocation();
  const showNav = !HIDE_NAV_ROUTES.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/swipe" element={<Swipe />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
