import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, BookOpen, User, Sun, Moon } from 'lucide-react';

export default function NavBar() {
  const location = useLocation();
  const [show, setShow] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  let lastScrollY = 0;

  useEffect(() => {
    const dark = localStorage.getItem('theme') === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 10);
      setShow(current < lastScrollY || current < 80);
      lastScrollY = current;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 
      w-[95vw] max-w-[480px] bg-glass-light dark:bg-glass-dark backdrop-blur-md 
      border border-white/10 rounded-full shadow-xl px-4 py-2 
      transition-all duration-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-y-6'}`}
    >
      <div className="flex justify-between items-center text-sm font-medium text-text-light dark:text-text-dark">
        <NavItem to="/dashboard" icon={<Home size={20} />} active={isActive('/dashboard')} />
        <NavItem to="/add" icon={<Plus size={20} />} active={isActive('/add')} />
        <NavItem to="/library" icon={<BookOpen size={20} />} active={isActive('/library')} />
        <NavItem to="/profile" icon={<User size={20} />} active={isActive('/profile')} />
        <button
          onClick={toggleTheme}
          className="hover:text-yellow-400 transition"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}

function NavItem({ to, icon, active }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center px-2 py-2 transition ${
        active ? 'text-yellow-400' : 'hover:text-yellow-400'
      }`}
    >
      {icon}
    </Link>
  );
}
