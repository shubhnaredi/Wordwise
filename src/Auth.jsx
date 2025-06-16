import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isReset, setIsReset] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard');
    });
  }, []);

  async function handleAuth() {
    setError(null);
    setSuccess(null);

    if (!email || (!password && !isReset)) {
      setError('Please fill all fields.');
      return;
    }

    if (isReset) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) setError(error.message);
      else setSuccess('📧 Check your email for reset instructions!');
      return;
    }

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('🎉 Welcome!');
      confetti();
      setTimeout(() => navigate('/dashboard'), 1200);
    }
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      <div className="w-full max-w-md sm:max-w-sm bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-xl border border-white/20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          {isReset ? '🔑 Reset Password' : isLogin ? 'Login to WordWise' : 'Sign Up to WordWise'}
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-white/10 p-2 rounded text-center">
            ❗ {error}
          </p>
        )}
        {success && (
          <p className="mb-4 text-sm text-green-400 bg-white/10 p-2 rounded text-center">
            {success}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded bg-white/20 placeholder-white/60 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!isReset && (
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 rounded bg-white/20 placeholder-white/60 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <button
          onClick={handleAuth}
          className="w-full py-3 mb-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-all"
        >
          {isReset ? '📧 Send Reset Link' : isLogin ? '🔓 Login' : '✍️ Sign Up'}
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 mb-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition-all"
        >
          🔐 Sign in with Google
        </button>

        {!isReset && (
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-white/70">
            <button onClick={() => setIsLogin(!isLogin)} className="underline mb-2 sm:mb-0">
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>
            <button onClick={() => setIsReset(true)} className="underline text-blue-300">
              Forgot password?
            </button>
          </div>
        )}

        {isReset && (
          <p className="mt-4 text-center text-sm">
            <button onClick={() => setIsReset(false)} className="underline text-blue-300">
              🔙 Back to login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
