import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isResetFlow, setIsResetFlow] = useState(false);
  const navigate = useNavigate();

  // 👇 Detect password recovery flow
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token') && hash.includes('type=recovery')) {
      supabase.auth.exchangeCodeForSession().then(() => {
        setIsResetFlow(true);
      });
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) navigate('/dashboard');
      });
    }
  }, []);

  async function handleLoginOrSignup() {
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) return alert(error.message);

    confetti();
    navigate('/dashboard');
  }

  async function handlePasswordReset() {
    if (password !== confirm) return alert("Passwords don't match");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) return alert(error.message);

    confetti();
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black px-4 text-white">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20">
        {isResetFlow ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">🔐 Set a New Password</h2>
            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-3 p-3 rounded bg-white/20 placeholder-white/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-4 p-3 rounded bg-white/20 placeholder-white/60"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button
              onClick={handlePasswordReset}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
            >
              ✅ Update Password
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">
              {isLogin ? 'Login' : 'Sign Up'} to WordWise
            </h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-3 rounded bg-white/20 placeholder-white/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-6 p-3 rounded bg-white/20 placeholder-white/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleLoginOrSignup}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            <p className="mt-4 text-center text-sm text-white/70">
              <button onClick={() => setIsLogin(!isLogin)} className="underline">
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
