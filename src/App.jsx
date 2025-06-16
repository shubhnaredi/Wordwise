import React, { useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Dashboard from './Dashboard';
import AddWord from './AddWord';
import Library from './Library';
import Profile from './Profile';
import Auth from './Auth';
import WordDetail from './WordDetail';
import { supabase } from './supabase';
import NavBar from './components/NavBar';
import ResetPassword from './ResetPassword';

function AppRoutes({ session }) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

useEffect(() => {
  const isProtectedPage = !['/auth', '/update-password'].includes(location.pathname);

  if (session && isProtectedPage && !hasRedirected.current) {
    hasRedirected.current = true;
    navigate('/dashboard');
  }
}, [session, location.pathname, navigate]);

  return (
    <>
      {session && !['/auth', '/update-password'].includes(location.pathname) && (
        <NavBar />
      )}

      <Routes>
        <Route path="/" element={<Navigate to={session ? '/dashboard' : '/auth'} />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddWord />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:id" element={<WordDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-inter transition-colors duration-300">
      <Router>
        <AppRoutes session={session} />
      </Router>
    </div>
  );
}
