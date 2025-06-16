import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const navigate = useNavigate();

  // STEP 1: Handle the recovery session from Supabase link
  useEffect(() => {
    const handleRecovery = async () => {
      const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

      if (error) {
        setMessage('❌ Invalid or expired reset link.');
      } else {
        setCanSubmit(true);
      }
    };

    handleRecovery();
  }, []);

  // STEP 2: Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Passwords don't match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage('✅ Password updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white px-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">🔐 Reset Password</h2>

        {message && <p className="text-center text-sm mb-4">{message}</p>}

        {canSubmit ? (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-white/20 text-white placeholder-white/70 mb-3"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded bg-white/20 text-white placeholder-white/70 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded"
            >
              Set New Password
            </button>
          </form>
        ) : (
          <p className="text-center text-white/60">🕐 Verifying reset link...</p>
        )}
      </div>
    </div>
  );
}
