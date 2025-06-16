import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setMessage('⚠️ Session not found. Click your reset email again.');
      }
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage('✅ Password updated! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#111827] text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">🔐 Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-white/10 text-white rounded outline-none placeholder-white/60 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !newPassword}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-semibold rounded transition-all"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        {message && <p className="text-sm text-center mt-4 text-white/80">{message}</p>}
      </div>
    </div>
  );
}
