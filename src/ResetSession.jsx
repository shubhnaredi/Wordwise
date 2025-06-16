// ResetSession.jsx
import { useEffect } from "react";
import { supabase } from "./supabase";

export default function ResetSession({ children }) {
  useEffect(() => {
    // This sets the session BEFORE routing can interfere
    supabase.auth.getSessionFromUrl({ storeSession: true });
  }, []);

  return children;
}
