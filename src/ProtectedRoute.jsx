import React from 'react';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="pt-28 text-center text-gray-500">Loading...</div>;

  return session ? children : <Navigate to="/" />;
}
