// src/contexts/UserContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase.js';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession(); // ✅ use this
      setSession(session);
      setLoading(false);
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ session, loading }}>
      {children}
    </UserContext.Provider>
  );
};
