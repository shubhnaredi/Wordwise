import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard');
    });
  }, []);

  async function handleAuth() {
    setError(null);
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      confetti();
      navigate('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black px-4 text-white">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Sign Up'} to WordWise
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-white/10 p-2 rounded text-center">
            ❗ {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded bg-white/20 placeholder-white/60 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded bg-white/20 placeholder-white/60 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleAuth}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-all"
        >
          {isLogin ? '🔓 Login' : '✍️ Sign Up'}
        </button>
        <p className="mt-4 text-center text-sm text-white/70">
          <button onClick={() => setIsLogin(!isLogin)} className="underline">
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
