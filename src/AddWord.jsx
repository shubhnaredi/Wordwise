import React, { useEffect, useState, useRef } from 'react';
import { supabase } from './supabase.js';
import { useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import confetti from 'canvas-confetti';

export default function AddWord() {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [meaningFetched, setMeaningFetched] = useState(false);

  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return navigate('/');
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('tags')
        .eq('id', user.id)
        .single();

      if (profile?.tags) {
        setUserTags(profile.tags.split(',').map((t) => t.trim()));
      }
    })();
  }, []);

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function fetchMeaning() {
    if (!word.trim()) return alert('⚠️ Please enter a word.');
    setIsFetching(true);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!res.ok) throw new Error('Not Found');
      const data = await res.json();
      const entry = data?.[0]?.meanings?.[0]?.definitions?.[0];
      if (entry) {
        setMeaning(entry.definition || '');
        setExample(entry.example || '');
        setMeaningFetched(true);
      } else {
        alert('❌ Meaning not found.');
      }
    } catch (err) {
      alert('❌ Error fetching meaning.');
    } finally {
      setIsFetching(false);
    }
  }

  async function saveWord() {
    if (!user || !word || !meaning) {
      alert('⚠️ Please make sure all fields are filled.');
      return;
    }

    setIsSaving(true);

    const { data: existing } = await supabase
      .from('words')
      .select('id')
      .eq('user_id', user.id)
      .ilike('word', word);

    if (existing?.length > 0) {
      alert('🚫 Word already exists.');
      setIsSaving(false);
      return navigate(`/library/${existing[0].id}`);
    }

    const { error } = await supabase.from('words').insert({
      user_id: user.id,
      word,
      meaning,
      example_sentence: example,
      user_note: note,
      tags: selectedTags.join(', '),
      date_added: new Date().toISOString(),
    });

    setIsSaving(false);

    if (error) return alert('❌ Failed to save: ' + error.message);

    confetti();
    alert('🎉 Word added successfully!');
    resetForm();
  }

  function resetForm() {
    setWord('');
    setMeaning('');
    setExample('');
    setNote('');
    setSelectedTags([]);
    setMeaningFetched(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <NavBar />
      <div className="pt-24 pb-28 px-4 max-w-xl mx-auto">
        <div className="rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 p-5 shadow-xl backdrop-blur-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-yellow-400">Add New Word</h1>

          <input
            ref={inputRef}
            type="text"
            value={word}
            onChange={(e) => {
              if (!meaningFetched) setWord(e.target.value);
            }}
            placeholder="Enter a word"
            className={`w-full mb-4 p-3 rounded-xl text-base sm:text-lg bg-white/30 dark:bg-white/10 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 ${
              meaningFetched ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={meaningFetched}
          />

          {!meaningFetched && (
            <button
              onClick={fetchMeaning}
              disabled={isFetching || !word.trim()}
              className="w-full mb-6 py-3 rounded-xl text-base sm:text-lg bg-yellow-400 text-black font-semibold hover:shadow-md disabled:opacity-50"
            >
              {isFetching ? '⏳ Fetching...' : '🔍 Fetch Meaning'}
            </button>
          )}

          {meaningFetched && (
            <>
              <div className="mb-4">
                <h3 className="font-semibold mb-1">📖 Meaning</h3>
                <div className="p-3 rounded-xl bg-white/20 dark:bg-white/10 text-sm sm:text-base">
                  {meaning}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1">🧠 Example</h3>
                <div className="p-3 rounded-xl bg-white/20 dark:bg-white/10 text-sm sm:text-base">
                  {example || '—'}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">🏷️ Tags</h3>
                {userTags.length > 0 ? (
                  <div className="flex overflow-x-auto gap-2 pb-2">
                    {userTags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-yellow-400 text-black'
                            : 'bg-white/30 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-yellow-300 hover:text-black'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No tags yet. Add tags in profile settings.</p>
                )}
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1">💡 Memory Aid (Optional)</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="E.g. Ubiquitous → Uber is everywhere!"
                  className="w-full p-3 rounded-xl bg-white/30 dark:bg-white/10 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 text-sm sm:text-base"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {meaningFetched && (
        <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-background-light dark:bg-background-dark border-t border-white/20 backdrop-blur-md flex gap-3">
          <button
            onClick={saveWord}
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-md disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : '✅ Save Word'}
          </button>
          <button
            onClick={resetForm}
            className="flex-1 py-3 rounded-xl bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white font-semibold shadow-md"
          >
            🔁 Got it
          </button>
        </div>
      )}
    </div>
  );
}
