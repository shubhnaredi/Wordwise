import React from 'react';
import NavBar from './components/NavBar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300 font-inter">
      <NavBar />
      <main className="pt-28 px-4">{children}</main>
    </div>
  );
}
