import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [message, setMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCanSubmit(true);
      } else {
        setMessage('❌ Invalid or expired link');
      }
    };
    checkSession();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) return setMessage("❌ Passwords don't match");

    const { error } = await supabase.auth.updateUser({ password: newPass });

    if (error) return setMessage(error.message);

    setMessage('✅ Password updated!');
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleUpdate} className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4">Set New Password</h2>
        {message && <p className="mb-4">{message}</p>}
        {canSubmit && (
          <>
            <input type="password" placeholder="New password" value={newPass}
              onChange={(e) => setNewPass(e.target.value)} className="w-full p-3 rounded mb-3" />
            <input type="password" placeholder="Confirm password" value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)} className="w-full p-3 rounded mb-3" />
            <button className="w-full bg-blue-600 py-2 rounded">Update Password</button>
          </>
        )}
      </form>
    </div>
  );
}
