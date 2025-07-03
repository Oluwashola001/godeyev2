import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) => `
    text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg
    ${isActive(path) 
      ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20' 
      : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-700/30'
    }
  `;

  return (
    <header className="
      sticky top-0 z-50 
      bg-white/90 dark:bg-gray-900/90 
      backdrop-blur-md 
      border-b border-gray-300/30 dark:border-gray-700/30 
      shadow-sm dark:shadow-gray-900/20
      transition-all duration-300
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <Eye className="w-8 h-8 text-amber-600 dark:text-amber-500 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-200" />
              <div className="absolute inset-0 w-8 h-8 text-amber-600 dark:text-amber-500 animate-pulse opacity-50">
                <Eye className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
                God'seye
              </h1>
              <p className="text-xs text-amber-600 dark:text-amber-400 -mt-1">Movie Search</p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2 flex-1 md:justify-end">
            <nav className="flex flex-wrap gap-2 justify-center">
              <Link to="/" className={navLinkClass('/')}>
                Home
              </Link>
              <Link to="/trending" className={navLinkClass('/trending')}>
                Trending
              </Link>
              <Link to="/movies" className={navLinkClass('/movies')}>
                Movies
              </Link>
              <Link to="/tvshows" className={navLinkClass('/tvshows')}>
                TV Shows
              </Link>
            </nav>

            {/* Theme Toggle */}
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
