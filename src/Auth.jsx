import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isResetFlow, setIsResetFlow] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const navigate = useNavigate();

  // Detect if this is a password reset link
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

  async function handleAuth() {
    if (!email || !password) return alert("Please enter email and password");

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) return alert(error.message);

    confetti();
    navigate('/dashboard');
  }

  async function handlePasswordReset() {
    if (password !== confirmPass) return alert("Passwords do not match");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return alert(error.message);

    confetti();
    navigate('/dashboard');
  }

  async function sendResetEmail() {
    if (!email) return alert("Enter your email");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return alert(error.message);
    alert("Reset email sent! Check your inbox.");
    setIsForgot(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white px-4">
      <div className="w-full max-w-sm bg-white dark:bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-neutral-200 dark:border-white/20 shadow-lg transition-all duration-300">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isResetFlow ? '🔐 Reset Password' : isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {/* RESET FLOW */}
        {isResetFlow ? (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-3 p-3 rounded bg-neutral-100 dark:bg-white/10 placeholder:text-neutral-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-4 p-3 rounded bg-neutral-100 dark:bg-white/10 placeholder:text-neutral-400"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <button
              onClick={handlePasswordReset}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded hover:opacity-90"
            >
              ✅ Set New Password
            </button>
          </>
        ) : (
          <>
            {/* FORGOT PASSWORD MODE */}
            {isForgot ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full mb-4 p-3 rounded bg-neutral-100 dark:bg-white/10 placeholder:text-neutral-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  onClick={sendResetEmail}
                  className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded hover:opacity-90"
                >
                  📩 Send Reset Email
                </button>
                <p className="mt-4 text-sm text-center text-neutral-500 dark:text-neutral-400">
                  <button onClick={() => setIsForgot(false)} className="underline">Back to Login</button>
                </p>
              </>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full mb-3 p-3 rounded bg-neutral-100 dark:bg-white/10 placeholder:text-neutral-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full mb-4 p-3 rounded bg-neutral-100 dark:bg-white/10 placeholder:text-neutral-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={handleAuth}
                  className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded hover:opacity-90"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>

                <div className="flex justify-between items-center mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                  <button onClick={() => setIsLogin(!isLogin)} className="underline">
                    {isLogin ? 'Create an account' : 'Already have one?'}
                  </button>
                  <button onClick={() => setIsForgot(true)} className="underline">
                    Forgot password?
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
