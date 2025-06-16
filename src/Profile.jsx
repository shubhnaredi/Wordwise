import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import NavBar from './components/NavBar';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      loadTags(user.id);
    });

    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  async function loadTags(user_id) {
    const { data, error } = await supabase
      .from('user_tags')
      .select('tag')
      .eq('user_id', user_id);
    if (!error) setTags(data.map((row) => row.tag));
  }

  async function addTag() {
    const clean = newTag.trim();
    if (!clean || tags.includes(clean)) return;
    const { error } = await supabase
      .from('user_tags')
      .insert({ user_id: user.id, tag: clean });
    if (!error) {
      setTags([...tags, clean]);
      setNewTag('');
    }
  }

  async function removeTag(tag) {
    const { error } = await supabase
      .from('user_tags')
      .delete()
      .eq('user_id', user.id)
      .eq('tag', tag);
    if (!error) {
      setTags(tags.filter((t) => t !== tag));
    }
  }

  function toggleDarkMode() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setIsDark(!isDark);
  }

  function copyId() {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <NavBar />
      <div className="pt-28 max-w-2xl mx-auto px-4">
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-yellow-400">👤 Profile</h1>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-xl hover:opacity-90"
            >
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {user && (
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-black dark:text-white">{user.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mt-1">
                ID: <span className="font-mono">{user.id.slice(0, 10)}...</span>
                <button
                  onClick={copyId}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  {copied ? '✅ Copied' : '📋 Copy'}
                </button>
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="font-semibold mb-2">🏷 My Tags</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm cursor-pointer hover:line-through"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="flex-grow p-2 rounded-xl bg-white/30 dark:bg-white/10 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                ➕
              </button>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl mt-4"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
