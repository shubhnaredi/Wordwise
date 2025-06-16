import React, { useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const url = new URL(window.location.href);
      const type = url.hash.includes('type=recovery');
      if (session && type) {
        setIsResetMode(true);
        window.history.replaceState({}, document.title, '/auth'); // Clean URL
      } else if (session) {
        navigate('/dashboard');
      }
    });
  }, []);

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else navigate('/dashboard');
  }

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Check your email to confirm signup.');
  }

  async function handleForgotPassword() {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert(error.message);
    else alert('Password reset link sent to your email.');
  }

  async function handlePasswordReset() {
    if (password !== confirm) return alert("Passwords don't match");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) alert(error.message);
    else {
      alert('✅ Password updated!');
      navigate('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-black px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">WordWise</h2>

        {isResetMode ? (
          <>
            <p className="mb-2 text-center text-sm">🔐 Set a new password</p>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-gray-100"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-gray-100"
            />
            <button
              onClick={handlePasswordReset}
              className="w-full py-3 bg-black text-white rounded"
            >
              ✅ Update Password
            </button>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-gray-100"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-gray-100"
            />
            <button
              onClick={isLogin ? handleLogin : handleSignup}
              className="w-full py-3 bg-black text-white rounded mb-3"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            <div className="text-sm text-center text-gray-500">
              <button onClick={() => setIsLogin(!isLogin)} className="underline mr-3">
                {isLogin ? 'New user? Sign up' : 'Already have an account?'}
              </button>
              <button onClick={handleForgotPassword} className="underline">
                Forgot password?
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
