import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import useLongPress from "../hooks/useLongPress";
import { motion } from "framer-motion";

export default function Library() {
  const [words, setWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWords();
  }, []);

  async function fetchWords() {
    const { data } = await supabase.from("words").select("*").order("date_added", { ascending: false });
    setWords(data);
  }

  function handleLongPress(wordId) {
    setMultiSelectMode(true);
    setSelectedWords([wordId]);
  }

  function toggleSelect(wordId) {
    if (!multiSelectMode) return navigate(`/library/${wordId}`);
    setSelectedWords((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]
    );
  }

  async function handleDelete() {
    if (!selectedWords.length) return;
    const confirmDelete = window.confirm(`Delete ${selectedWords.length} word(s)?`);
    if (!confirmDelete) return;

    const { error } = await supabase.from("words").delete().in("id", selectedWords);
    if (!error) {
      setWords(words.filter((w) => !selectedWords.includes(w.id)));
      setSelectedWords([]);
      setMultiSelectMode(false);
    }
  }

  function handleClearSelection() {
    setSelectedWords([]);
    setMultiSelectMode(false);
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Library</h2>
        {multiSelectMode && (
          <div className="space-x-2">
            <button onClick={handleClearSelection} className="text-sm bg-gray-200 px-3 py-1 rounded">
              Clear
            </button>
            <button onClick={handleDelete} className="text-sm bg-red-500 text-white px-3 py-1 rounded">
              Delete ({selectedWords.length})
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {words.map((word) => {
          const bind = useLongPress(() => handleLongPress(word.id), 600);

          return (
            <motion.div
              key={word.id}
              {...bind}
              onClick={() => toggleSelect(word.id)}
              className={`border p-3 rounded cursor-pointer ${
                selectedWords.includes(word.id)
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-medium">{word.word}</h3>
              <p className="text-sm text-gray-600">{word.meaning}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}