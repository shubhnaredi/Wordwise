import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './contexts/UserContext';
import { supabase } from './supabase';
import WordItem from "./WordItem";
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from "react-icons/fi";


const Library = () => {
  const { session } = useContext(UserContext);
  const [words, setWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (session) fetchWords();
  }, [session]);

  const fetchWords = async () => {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date_added', { ascending: false });

    if (error) console.error('Error fetching words:', error);
    else {
      setWords(data);
      const allTags = new Set(data.flatMap(word => word.tags || []));
      setAvailableTags([...allTags]);
    }
  };

  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? word.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-white">📚 Your Vocabulary</h1>

      {/* Search bar */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search words..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/20 focus:outline-none"
        />
      </div>

      {/* Tags filter */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm border transition duration-200 ${
                selectedTag === tag
                  ? 'bg-white text-black font-semibold'
                  : 'text-white border-white/30 hover:bg-white/10'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Word list */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredWords.map(word => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <WordItem word={word} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredWords.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/70 mt-10"
        >
          <p className="text-lg">No words found.</p>
          <p className="text-sm">Try changing the search or tag filters.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Library;
