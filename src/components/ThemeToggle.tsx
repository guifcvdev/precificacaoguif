
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="modern-button-secondary interactive-element relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:border-primary/30 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute h-5 w-5 transition-all duration-300 ease-in-out ${
            theme === 'light'
              ? 'rotate-0 scale-100 opacity-100 text-orange-500'
              : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon
          className={`absolute h-5 w-5 transition-all duration-300 ease-in-out ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100 text-primary'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      
      {/* Glow effect sutil */}
      {theme === 'dark' && (
        <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse" />
      )}
    </button>
  );
};

export default ThemeToggle;
