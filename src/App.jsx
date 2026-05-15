import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ScreenJumper } from './components/chrome';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './stores/authStore';
import { Analytics } from '@vercel/analytics/react';
import ErrorBoundary from './components/ErrorBoundary';
import './styles.css';

const Landing              = React.lazy(() => import('./screens/Landing'));
const Onboarding           = React.lazy(() => import('./screens/Onboarding'));
const Dashboard            = React.lazy(() => import('./screens/Dashboard'));
const BadgeDetail          = React.lazy(() => import('./screens/BadgeDetail'));
const Partners             = React.lazy(() => import('./screens/Partners'));
const Login                = React.lazy(() => import('./screens/Login').then(m => ({ default: m.Login })));
const Signup               = React.lazy(() => import('./screens/Signup').then(m => ({ default: m.Signup })));
const Profile              = React.lazy(() => import('./screens/Profile').then(m => ({ default: m.Profile })));
const LeaderboardsPage     = React.lazy(() => import('./screens/LeaderboardsPage'));
const FriendsPage          = React.lazy(() => import('./screens/FriendsPage'));
const WorkoutsPage         = React.lazy(() => import('./screens/WorkoutsPage'));
const InsightsPage         = React.lazy(() => import('./screens/InsightsPage'));
const GoalsPage            = React.lazy(() => import('./screens/GoalsPage'));
const NotificationCenterPage = React.lazy(() => import('./screens/NotificationCenterPage'));
const BadgesPage           = React.lazy(() => import('./screens/BadgesPage'));

const ROUTE_MAP = {
  landing: '/',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  badge: '/badge',
  badges: '/badges',
  partners: '/partners',
  login: '/login',
  signup: '/signup',
  profile: '/profile',
  leaderboards: '/leaderboards',
  friends: '/friends',
  workouts:      '/workouts',
  insights:      '/insights',
  goals:         '/goals',
  notifications: '/notifications',
};

const PATH_TO_KEY = {
  '/': 'landing',
  '/onboarding': 'onboarding',
  '/dashboard': 'dashboard',
  '/badge': 'badge',
  '/badges': 'badges',
  '/partners': 'partners',
  '/login': 'login',
  '/signup': 'signup',
  '/profile': 'profile',
  '/leaderboards': 'leaderboards',
  '/friends': 'friends',
  '/workouts':      'workouts',
  '/insights':      'insights',
  '/goals':         'goals',
  '/notifications': 'notifications',
};

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
    </div>
  );
}

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
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      <ScreenJumper route={routeKey} onNav={go} />
      <div id="main-content">
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/leaderboards" element={
            <ProtectedRoute><LeaderboardsPage onNav={go} /></ProtectedRoute>
          } />
          <Route path="/friends" element={
            <ProtectedRoute><FriendsPage onNav={go} /></ProtectedRoute>
          } />
          <Route path="/workouts" element={
            <ProtectedRoute><WorkoutsPage onNav={go} /></ProtectedRoute>
          } />
          <Route path="/insights" element={
            <ProtectedRoute><InsightsPage onNav={go} /></ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute><GoalsPage onNav={go} /></ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute><NotificationCenterPage onNav={go} /></ProtectedRoute>
          } />
          <Route path="/badges" element={
            <ProtectedRoute><BadgesPage onNav={go} /></ProtectedRoute>
          } />
          <Route path="*" element={<Landing onNav={go} />} />
        </Routes>
      </Suspense>
      </div>
    </>
  );
}

function App() {
  const { restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
        <Analytics />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
