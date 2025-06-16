// ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase.js';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.exchangeCodeForSession().then(({ error }) => {
      if (error) {
        setMessage('⚠️ Invalid or expired reset link.');
      } else {
        setSessionReady(true);
        window.history.replaceState({}, document.title, '/reset-password');
      }
    });
  }, []);

  async function updatePassword() {
    if (password !== confirm) {
      setMessage("❌ Passwords don't match");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('✅ Password updated! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-600">
        <p>{message || 'Loading reset form...'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-black px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">🔐 Set New Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="w-full mb-3 p-3 rounded bg-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full mb-4 p-3 rounded bg-gray-100"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          onClick={updatePassword}
          className="w-full py-3 bg-black text-white rounded"
        >
          ✅ Update Password
        </button>
        {message && <p className="mt-3 text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
}