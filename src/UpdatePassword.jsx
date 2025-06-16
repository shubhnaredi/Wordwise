import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const { error } = await supabase.auth.getSessionFromUrl();
      if (error) {
        setMessage("❌ Invalid or expired reset link.");
      } else {
        setReady(true);
      }
    };
    run();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setMessage("⚠️ Please fill both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage('✅ Password updated! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#111827] px-4 text-white font-inter">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-semibold text-center mb-4">🔐 Set Your New Password</h2>

        {message && <p className="text-center text-sm mb-4 text-white/80">{message}</p>}

        {ready && (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 p-3 rounded-md bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-6 p-3 rounded-md bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-semibold rounded transition-all"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {!ready && !message && (
          <p className="text-center text-white/70 text-sm mt-6">🔄 Validating link...</p>
        )}
      </div>
    </div>
  );
}
