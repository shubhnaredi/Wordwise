import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const { error } = await supabase.auth.getSessionFromUrl(); // Handles token in URL
      if (error) {
        setMessage("❌ Couldn't process reset token. Try again.");
      }
    };
    run();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage('✅ Password updated. Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-gray-800 text-white px-4">
      <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">🔐 Set New Password</h2>
        {message && <div className="text-center mb-4 text-sm">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-4 p-3 rounded bg-white/10 text-white placeholder-white/60 outline-none"
          />
          <button
            type="submit"
            disabled={!newPassword || loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-semibold rounded"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
