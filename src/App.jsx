import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ScreenJumper } from './components/chrome';
import { ProtectedRoute } from './components/ProtectedRoute';
import Landing from './screens/Landing';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import BadgeDetail from './screens/BadgeDetail';
import Partners from './screens/Partners';
import { Login } from './screens/Login';
import { Signup } from './screens/Signup';
import { Profile } from './screens/Profile';
import { useAuthStore } from './stores/authStore';
import { Analytics } from '@vercel/analytics/react';
import './styles.css';

const ROUTE_MAP = {
  landing: '/',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  badge: '/badge',
  partners: '/partners',
  login: '/login',
  signup: '/signup',
  profile: '/profile',
};

const PATH_TO_KEY = {
  '/': 'landing',
  '/onboarding': 'onboarding',
  '/dashboard': 'dashboard',
  '/badge': 'badge',
  '/partners': 'partners',
  '/login': 'login',
  '/signup': 'signup',
  '/profile': 'profile',
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/partners" element={<Partners onNav={go} />} />
        <Route path="/onboarding" element={
          <ProtectedRoute><Onboarding onNav={go} /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard onNav={go} /></ProtectedRoute>
        } />
        <Route path="/badge" element={
          <ProtectedRoute><BadgeDetail onNav={go} /></ProtectedRoute>
        } />
        <Route path="/badge/:id" element={
          <ProtectedRoute><BadgeDetail onNav={go} /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="*" element={<Landing onNav={go} />} />
      </Routes>
    </>
  );
}

function App() {
  const { restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
