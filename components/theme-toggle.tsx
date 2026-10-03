'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useSyncExternalStore } from 'react';

import { Switch } from '@/components/ui/switch';

type Theme = 'dark' | 'light';

function getTheme(): Theme {
  const savedTheme = window.localStorage.getItem('portfolio-theme') as Theme | null;
  return savedTheme ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}

function subscribeToTheme(onChange: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  const handleStorage = () => onChange();

  window.addEventListener('portfolio-theme-change', handleStorage);
  window.addEventListener('storage', handleStorage);
  mediaQuery.addEventListener('change', handleStorage);

  return () => {
    window.removeEventListener('portfolio-theme-change', handleStorage);
    window.removeEventListener('storage', handleStorage);
    mediaQuery.removeEventListener('change', handleStorage);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, () => 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function updateTheme(lightMode: boolean) {
    const nextTheme: Theme = lightMode ? 'light' : 'dark';
    window.localStorage.setItem('portfolio-theme', nextTheme);
    window.dispatchEvent(new Event('portfolio-theme-change'));
  }

  return (
    <label className="theme-control" htmlFor="portfolio-theme-switch">
      <Moon aria-hidden="true" />
      <Switch
        aria-label="Use light mode"
        checked={theme === 'light'}
        className="theme-switch"
        id="portfolio-theme-switch"
        onCheckedChange={updateTheme}
      />
      <Sun aria-hidden="true" />
    </label>
  );
}
