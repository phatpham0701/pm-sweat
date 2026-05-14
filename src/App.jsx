import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ScreenJumper } from './components/chrome';
import Landing from './screens/Landing';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import BadgeDetail from './screens/BadgeDetail';
import Partners from './screens/Partners';
import './styles.css';

const ROUTE_MAP = {
  landing: '/',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  badge: '/badge',
  partners: '/partners',
};

const PATH_TO_KEY = {
  '/': 'landing',
  '/onboarding': 'onboarding',
  '/dashboard': 'dashboard',
  '/badge': 'badge',
  '/partners': 'partners',
};

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (r) => {
    navigate(ROUTE_MAP[r] || '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const routeKey = PATH_TO_KEY[location.pathname] || 'landing';

  return (
    <>
      <ScreenJumper route={routeKey} onNav={go} />
      <Routes>
        <Route path="/" element={<Landing onNav={go} />} />
        <Route path="/onboarding" element={<Onboarding onNav={go} />} />
        <Route path="/dashboard" element={<Dashboard onNav={go} />} />
        <Route path="/badge" element={<BadgeDetail onNav={go} />} />
        <Route path="/badge/:id" element={<BadgeDetail onNav={go} />} />
        <Route path="/partners" element={<Partners onNav={go} />} />
        <Route path="*" element={<Landing onNav={go} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
