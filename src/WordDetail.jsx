import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import NavBar from './components/NavBar.jsx';

export default function WordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState(null);

  useEffect(() => {
    async function fetchWord() {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setWord(data);
      }
    }

    fetchWord();
  }, [id]);

  if (!word) {
    return (
      <div className="min-h-screen pt-28 text-center text-gray-400 dark:text-gray-500">
        <NavBar />
        <p>Loading word details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <NavBar />
      <div className="pt-28 max-w-xl mx-auto px-4">
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20">
          <h1 className="text-3xl font-bold mb-2 text-yellow-400">{word.word}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Added: {new Date(word.date_added).toLocaleDateString()}</p>

          <div className="mb-4">
            <h2 className="font-semibold">📖 Meaning</h2>
            <p className="text-base">{word.meaning}</p>
          </div>

          <div className="mb-4">
            <h2 className="font-semibold">🧠 Example</h2>
            <p className="text-base">{word.example_sentence || '—'}</p>
          </div>

          <div className="mb-4">
            <h2 className="font-semibold">💬 Note</h2>
            <p className="text-base">{word.user_note || '—'}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold">🏷 Tags</h2>
            <p>{word.tags || '—'}</p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white px-4 py-2 rounded"
          >
            ⬅️ Back
          </button>
        </div>
      </div>
    </div>
  );
}
