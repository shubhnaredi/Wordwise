import React, { useEffect, useState } from 'react';

export default function ToggleDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem('theme') === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <button
      onClick={toggle}
      className="w-10 h-5 bg-white/30 dark:bg-white/10 rounded-full flex items-center p-1 transition relative"
    >
      <div
        className={`h-3.5 w-3.5 bg-white rounded-full shadow-md transform transition ${
          isDark ? 'translate-x-5' : 'translate-x-0'
        }`}
      ></div>
    </button>
  );
}
