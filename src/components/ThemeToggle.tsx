// Enhanced theme toggle with better visual feedback
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2 rounded-full transition-all duration-300 group
        bg-gray-200/80 dark:bg-gray-700/80 
        hover:bg-gray-300/90 dark:hover:bg-gray-600/90
        border border-gray-300/50 dark:border-gray-600/50
        hover:border-amber-400/50 dark:hover:border-amber-400/50
        shadow-sm hover:shadow-md
      "
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`
            absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 
            ${theme === 'dark' 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
            }
          `}
        />
        <Moon 
          className={`
            absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 
            ${theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
            }
          `}
        />
      </div>
      
      {/* Ripple effect on click */}
      <div className="
        absolute inset-0 rounded-full opacity-0 group-active:opacity-20 
        bg-amber-400 transition-opacity duration-150
      " />
    </button>
  );
};