
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTheme();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleTheme}
          onKeyDown={handleKeyDown}
          className="transition-all duration-300 ease-in-out hover:scale-105"
          aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
          tabIndex={0}
        >
          <div className="transition-transform duration-300 ease-in-out">
            {theme === 'light' ? (
              <Moon className="w-4 h-4 mr-2" />
            ) : (
              <Sun className="w-4 h-4 mr-2" />
            )}
          </div>
          <span className="hidden sm:inline transition-opacity duration-300">
            {theme === 'light' ? 'Escuro' : 'Claro'}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Alternar para tema {theme === 'light' ? 'escuro' : 'claro'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
