import React, { useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import { useNavigate } from 'react-router-dom';
import { Button } from "./components/ui/button"


export default function Profile() {
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/');
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('tags')
        .eq('id', user.id)
        .single();

      if (profile?.tags) {
        const tagArray = profile.tags.split(',').map(t => t.trim());
        setTags(tagArray);
      }
    })();
  }, []);

  async function updateTags(updatedTags) {
    const { error } = await supabase
      .from('profiles')
      .update({ tags: updatedTags.join(', ') })
      .eq('id', user.id);

    if (!error) {
      setTags(updatedTags);
      setNewTag('');
    } else {
      alert(error.message);
    }
  }

  function handleAddTag() {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      updateTags([...tags, tag]);
    }
  }

  function handleDeleteTag(tagToRemove) {
    updateTags(tags.filter(tag => tag !== tagToRemove));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <div className="max-w-xl mx-auto pt-28 px-4">
        <div className="rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 p-6 shadow-xl backdrop-blur-md">
          <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">👤 Profile</h1>

          {user && (
            <>
              <div className="mb-4">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="mb-4">
                <strong>Name:</strong> {user.user_metadata?.name || '—'}
              </div>
              <div className="mb-4">
                <strong>User ID:</strong>{' '}
                <span
                  onClick={() => {
                    navigator.clipboard.writeText(user.id);
                    alert('✅ Copied ID');
                  }}
                  className="cursor-pointer underline text-blue-400"
                >
                  {user.id.slice(0, 8)}... (click to copy)
                </span>
              </div>
            </>
          )}

          <hr className="my-6 border-white/20" />

          <h2 className="text-xl font-semibold mb-2">🏷️ Your Tags</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span
                key={tag}
                className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                #{tag}
                <button
                  onClick={() => handleDeleteTag(tag)}
                  className="text-black hover:text-red-600 font-bold"
                >
                  ✖
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Add new tag"
              className="flex-1 p-2 rounded-xl bg-white/30 dark:bg-white/10 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400"
            />
            <Button variant="secondary" onClick={handleAddTag}>
              ➕ Add
            </Button>
          </div>

          <hr className="my-6 border-white/20" />

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            🔓 Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
