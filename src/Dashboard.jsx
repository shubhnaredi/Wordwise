import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase.js';
import NavBar from './components/NavBar';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [totalWords, setTotalWords] = useState(0);
  const [revisedToday, setRevisedToday] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: words } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', user.id);

    const { data: stats } = await supabase
      .from('revision_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0]);

    setTotalWords(words?.length || 0);
    setRevisedToday(stats?.[0]?.revised_count || 0);
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-inter transition-colors duration-300">
      <NavBar />
      <div className="relative z-0 pt-28 px-6 sm:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center drop-shadow">📊 Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <DashboardCard title="Total Words Added" value={totalWords} icon="📚" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <DashboardCard title="Words Revised Today" value={revisedToday} icon="🔁" />
          </motion.div>
        </div>

        <motion.div
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/add"><DashboardButton label="➕ Add New Word" /></Link>
          <Link to="/library"><DashboardButton label="📖 Review Library" /></Link>
          <Link to="/quiz"><DashboardButton label="🎴 Flashcard Mode" /></Link>
        </motion.div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-inner border border-black/10 dark:border-white/10 backdrop-blur-md">
      <p className="text-lg font-semibold mb-1">{icon} {title}</p>
      <p className="text-3xl font-bold text-yellow-400">{value}</p>
    </div>
  );
}

function DashboardButton({ label }) {
  return (
    <div className="bg-glass-light dark:bg-glass-dark p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition text-center border border-black/10 dark:border-white/10 cursor-pointer">
      <span className="text-lg font-medium text-black dark:text-white">{label}</span>
    </div>
  );
}