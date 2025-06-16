import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function WordItem({ word, selected, onSelect, onLongPress }) {
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      onClick={() => {
        if (onSelect) {
          onSelect(word.id);
        } else {
          navigate(`/library/${word.id}`);
        }
      }}
      onPointerDown={(e) => {
        if (onLongPress) {
          const timeout = setTimeout(() => onLongPress(word.id), 500);
          e.target.onpointerup = () => clearTimeout(timeout);
        }
      }}
      className={`group relative rounded-xl border border-border-light dark:border-border-dark bg-white/50 dark:bg-black/30 backdrop-blur-md shadow-md p-4 transition-all duration-300 hover:shadow-lg cursor-pointer ${
        selected ? 'ring-2 ring-primary dark:ring-offset-gray-800' : ''
      }`}
    >
      <h3 className="text-xl font-semibold text-text-light dark:text-white mb-1">{word.word}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{word.meaning}</p>
      <div className="absolute top-2 right-3">
        {word.tags?.length > 0 && (
          <span className="text-xs px-2 py-1 bg-primary text-white rounded-full">
            {word.tags[0]}
          </span>
        )}
      </div>
    </motion.div>
  );
}
