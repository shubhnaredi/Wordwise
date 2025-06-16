import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import confetti from 'canvas-confetti';

export default function AddWord() {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [note, setNote] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const predefinedTags = ['GRE', 'TOEFL', 'Casual', 'Formal', 'Slang']; // Later: from /profile
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/');
    });
  }, []);

  async function fetchMeaning() {
    if (!word) return;
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      const first = data[0];
      setMeaning(first.meanings?.[0]?.definitions?.[0]?.definition || '');
      setExample(first.meanings?.[0]?.definitions?.[0]?.example || '');
      setShowResult(true);
    }
  }

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function saveWord() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !word || !meaning) return;

    const { data: existing } = await supabase
      .from('words')
      .select('id')
      .eq('user_id', user.id)
      .ilike('word', word);

    if (existing.length > 0) {
      alert('🚫 Word already exists.');
      return navigate(`/library/${existing[0].id}`);
    }

    const { error } = await supabase.from('words').insert({
      user_id: user.id,
      word,
      meaning,
      example_sentence: example,
      user_note: note,
      tags: selectedTags.join(', ')
    });

    if (!error) {
      confetti();
      setWord('');
      setMeaning('');
      setExample('');
      setNote('');
      setSelectedTags([]);
      setShowResult(false);
    } else {
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
      <NavBar />
      <div className="pt-28 px-4 max-w-2xl mx-auto">
        <div className="rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 p-6 shadow-xl backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">➕ Add New Word</h1>

          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word"
            className="w-full mb-4 p-3 rounded-xl bg-white/30 dark:bg-white/10 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400"
          />

          <div className="flex flex-wrap gap-2 mb-4">
            {predefinedTags.map((tag) => (
              <span
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white/30 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-yellow-300 hover:text-black'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="💭 Memory note (optional)"
            className="w-full mb-4 p-3 rounded-xl bg-white/30 dark:bg-white/10 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400"
          />

          <button
            onClick={fetchMeaning}
            className="w-full mb-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:shadow-md"
          >
            🔍 Fetch Meaning
          </button>

          {showResult && (
            <>
              <div className="mb-4">
                <h3 className="font-semibold mb-1">📖 Meaning</h3>
                <div className="p-3 rounded-xl bg-white/20 dark:bg-white/10 text-sm text-black dark:text-white">
                  {meaning || '—'}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-1">🧠 Example</h3>
                <div className="p-3 rounded-xl bg-white/20 dark:bg-white/10 text-sm text-black dark:text-white">
                  {example || '—'}
                </div>
              </div>

              <button
                onClick={saveWord}
                className="w-full mt-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-md"
              >
                ✅ Save Word
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
