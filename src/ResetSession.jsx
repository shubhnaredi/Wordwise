// ResetSession.jsx (patched for Supabase v2+)
import { useEffect } from 'react';
import { supabase } from './supabase';

export default function ResetSession({ children }) {
  useEffect(() => {
    // For Supabase v2 — handles password reset, magic links, etc.
    supabase.auth.exchangeCodeForSession();
  }, []);

  return children;
}
