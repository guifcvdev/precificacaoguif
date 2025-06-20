
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleTheme}
      className="transition-colors"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 mr-2" />
      ) : (
        <Sun className="w-4 h-4 mr-2" />
      )}
      <span className="hidden sm:inline">
        {theme === 'light' ? 'Escuro' : 'Claro'}
      </span>
    </Button>
  );
};

export default ThemeToggle;
