import React, { useEffect, useState, useRef } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import confetti from 'canvas-confetti';

function normalize(text) {
  return text.trim().toLowerCase().replace(/[^a-z]/g, '');
}

function stem(word) {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('es') && word.length > 4) return word.slice(0, -2);
  if (word.endsWith('s') && word.length > 3) return word.slice(0, -1);
  if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3);
  if (word.endsWith('ed') && word.length > 4) return word.slice(0, -2);
  return word;
}

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
  const [shake, setShake] = useState(false);

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

      const { data: tagData } = await supabase
        .from('user_tags')
        .select('tag')
        .eq('user_id', user.id);

      setUserTags(tagData?.map((t) => t.tag) || []);
    })();
  }, []);

  const fetchMeaning = async () => {
    const cleanWord = word.trim();
    if (!cleanWord) return triggerShake('Please enter a word.');

    setIsFetching(true);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
      const data = await res.json();
      const entry = data?.[0]?.meanings?.[0]?.definitions?.[0];
      if (entry) {
        setMeaning(entry.definition || '');
        setExample(entry.example || '');
        setMeaningFetched(true);
      } else {
        triggerShake('Meaning not found.');
      }
    } catch (err) {
      triggerShake('Error fetching meaning.');
    } finally {
      setIsFetching(false);
    }
  };

  const triggerShake = (msg) => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
    alert(msg);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetForm = () => {
    setWord('');
    setMeaning('');
    setExample('');
    setNote('');
    setSelectedTags([]);
    setMeaningFetched(false);
    inputRef.current?.focus();
  };

  const saveWord = async () => {
    if (!word || !meaning) return triggerShake('Word and meaning are required.');

    const rawInput = normalize(word);
    const stemInput = stem(rawInput);

    const { data: existing } = await supabase
      .from('words')
      .select('word')
      .eq('user_id', user.id);

    const duplicates = existing?.some((w) => stem(normalize(w.word)) === stemInput);
    if (duplicates) return triggerShake('This word or its form already exists.');

    const { error } = await supabase.from('words').insert({
      user_id: user.id,
      word: word.trim(),
      meaning,
      example_sentence: example,
      user_note: note,
      tags: selectedTags.join(', '),
      date_added: new Date().toISOString(),
    });

    if (error) return alert('Error saving word: ' + error.message);

    confetti();
    alert('Word saved successfully!');
    resetForm();
  };

  return (
    <div className="pt-24 pb-32 px-4 min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <NavBar />
      <div className="max-w-xl mx-auto rounded-2xl border border-white/10 backdrop-blur-md bg-glass-light dark:bg-glass-dark p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-center mb-6">Add New Word</h1>

        <input
          ref={inputRef}
          value={word}
          onChange={(e) => setWord(e.target.value)}
          disabled={meaningFetched}
          placeholder="Enter a word"
          className={`w-full mb-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 ${shake ? 'animate-shake border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
        />

        {!meaningFetched && (
          <button
            onClick={fetchMeaning}
            className="w-full mb-6 p-3 bg-yellow-400 hover:bg-yellow-300 dark:hover:bg-yellow-500 text-black font-semibold rounded-xl transition"
          >
            {isFetching ? 'Fetching...' : 'Fetch Meaning'}
          </button>
        )}

        {meaningFetched && (
          <>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Meaning</h3>
              <div className="p-3 rounded-xl bg-surface-light dark:bg-surface-dark">{meaning}</div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Example</h3>
              <div className="p-3 rounded-xl bg-surface-light dark:bg-surface-dark">{example || '—'}</div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Your Note</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Optional mnemonic or memory aid"
              />
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {userTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full border text-sm transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-yellow-300 dark:bg-yellow-500 text-black border-black'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-400 dark:border-gray-600'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={saveWord}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition"
              >
                Save Word
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 rounded-xl transition"
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
