'use client';

import { useEffect } from 'react';

export default function ThemeToggle() {
  useEffect(() => {
    try {
      if (localStorage.getItem('theme') === 'light') document.documentElement.dataset.theme = 'light';
      else document.documentElement.dataset.theme = 'dark';
    } catch {
      document.documentElement.dataset.theme = 'dark';
    }
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // ignore storage errors
    }
  }

  return (
    <button type="button" className="btn secondary theme-toggle" onClick={toggle}>
      <span className="label-to-light">Switch to light mode</span>
      <span className="label-to-dark">Switch to dark mode</span>
    </button>
  );
}
