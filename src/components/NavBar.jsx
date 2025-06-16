import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ToggleDarkMode from './ToggleDarkMode';

export default function NavBar() {
  const location = useLocation();
  const [show, setShow] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 10);

      if (current > lastScrollY && current > 80) {
        setShow(false); // scroll down
      } else {
        setShow(true); // scroll up
      }
      lastScrollY = current;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        px-6 py-3 rounded-full
        max-w-[90vw] sm:max-w-[720px]
        shadow-xl transition-all duration-300
        bg-glass-light dark:bg-glass-dark backdrop-blur-md border border-white/10
        ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95 -translate-y-6'}
      `}
    >
      <div className="flex justify-between items-center gap-6 text-sm font-medium text-text-light dark:text-text-dark">
        <Link to="/dashboard" className={navLink(location.pathname === '/dashboard')}>🏠 Dashboard</Link>
        <Link to="/add" className={navLink(location.pathname === '/add')}>➕ Add</Link>
        <Link to="/library" className={navLink(location.pathname === '/library')}>📚 Library</Link>
        <Link to="/profile" className={navLink(location.pathname === '/profile')}>👤 Profile</Link>
        <ToggleDarkMode />
      </div>
    </nav>
  );
}

function navLink(active) {
  return `transition duration-200 ${
    active
      ? 'text-yellow-400 underline underline-offset-4'
      : 'hover:text-yellow-400'
  }`;
}
