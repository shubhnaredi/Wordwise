import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ToggleDarkMode from './ToggleDarkMode.jsx';

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
        setShow(false);
      } else {
        setShow(true);
      }
      lastScrollY = current;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        px-4 py-2 sm:px-6 sm:py-3 rounded-2xl w-[95vw] max-w-sm sm:max-w-[720px]
        transition-all duration-300 backdrop-blur-xl shadow-xl border border-white/10
        ${
          show
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 -translate-y-6 pointer-events-none'
        }
        ${
          scrolled
            ? 'bg-surface-light/60 dark:bg-surface-dark/60'
            : 'bg-glass-light dark:bg-glass-dark'
        }
      `}
    >
      <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-2 text-xs sm:text-sm font-medium text-text-light dark:text-text-dark">
        <NavLinkItem to="/dashboard" active={location.pathname === '/dashboard'}>
          🏠 Dashboard
        </NavLinkItem>
        <NavLinkItem to="/add" active={location.pathname === '/add'}>
          ➕ Add
        </NavLinkItem>
        <NavLinkItem to="/library" active={location.pathname === '/library'}>
          📚 Library
        </NavLinkItem>
        <NavLinkItem to="/profile" active={location.pathname === '/profile'}>
          👤 Profile
        </NavLinkItem>
        <ToggleDarkMode />
      </div>
    </nav>
  );
}

function NavLinkItem({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 min-w-[44px] min-h-[44px] text-center rounded-full transition duration-200
        ${
          active
            ? 'bg-yellow-300/90 text-black font-semibold shadow-inner'
            : 'hover:bg-yellow-300/20'
        }`}
    >
      {children}
    </Link>
  );
}
