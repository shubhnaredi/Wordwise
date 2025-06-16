import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import NavBar from './components/NavBar';
import { useNavigate } from 'react-router-dom';

export default function Library() {
  const [words, setWords] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWords();
  }, []);

  async function fetchWords() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/');

    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', user.id)
      .order('date_added', { ascending: false });

    if (!error) {
      setWords(data);
      setLoading(false);
    }
  }

  function toggleSelect(id) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function deleteSelected() {
    if (!selectedIds.length) return alert('No words selected.');
    const confirm = window.confirm('Delete selected words?');
    if (!confirm) return;

    const { error } = await supabase.from('words').delete().in('id', selectedIds);
    if (!error) {
      setWords(words.filter(w => !selectedIds.includes(w.id)));
      setSelectedIds([]);
    }
  }

  function exportSelected() {
    const selectedWords = words.filter(w => selectedIds.includes(w.id));
    const text = selectedWords.map(w => `${w.word}: ${w.meaning}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard ✅');
  }

  const filtered = words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    (w.tags && w.tags.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <NavBar />
      <div className="pt-28 max-w-6xl mx-auto px-6 sm:px-8">
        <h1 className="text-4xl font-bold mb-6 text-center">📚 Word Library</h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search word or tag"
            className="w-full sm:w-64 p-3 rounded-xl bg-white/80 dark:bg-glass-dark text-black dark:text-white placeholder-black/60 dark:placeholder-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-400 dark:text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No matching words.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-24">
            {filtered.map(word => {
              const isSelected = selectedIds.includes(word.id);
              return (
                <div
                  key={word.id}
                  className={`relative group transition-all duration-200 backdrop-blur-md rounded-xl border ${
                    isSelected
                      ? 'ring-2 ring-yellow-400 shadow-lg scale-[1.01]'
                      : 'hover:ring-1 hover:ring-gray-400'
                  } bg-white/30 dark:bg-white/10 hover:shadow-md p-5 cursor-pointer`}
                  onClick={() => navigate(`/library/${word.id}`)}
                >
                  <div className="absolute top-3 left-3">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(word.id);
                      }}
                      className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? 'bg-yellow-400 border-yellow-400'
                          : 'border-gray-400 bg-white dark:bg-black'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-[6px] h-[6px] bg-black dark:bg-white rounded-sm" />
                      )}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-yellow-500 ml-7">{word.word}</h2>
                  <p className="text-sm mt-1 text-black dark:text-white line-clamp-3 ml-7">
                    {word.meaning}
                  </p>

                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 ml-7">
                    📅 {new Date(word.date_added).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 right-6 flex gap-3 z-50">
          <button
            onClick={deleteSelected}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-xl"
          >
            🗑 Delete ({selectedIds.length})
          </button>
          <button
            onClick={exportSelected}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-xl"
          >
            📤 Copy / Export
          </button>
        </div>
      )}
    </div>
  );
}
