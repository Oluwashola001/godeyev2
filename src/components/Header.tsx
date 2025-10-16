import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Eye, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) => `
    block w-full text-right text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg
    ${isActive(path) 
      ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20' 
      : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-700/30'
    }
  `;

  return (
    <>
      <header className="
        sticky top-0 z-50 
        bg-white/90 dark:bg-gray-900/90 
        backdrop-blur-md 
        border-b border-gray-300/30 dark:border-gray-700/30 
        shadow-sm dark:shadow-gray-900/20
        transition-all duration-300
      ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-0.1 group flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
               <img 
                  src="/logo.png" 
                  alt="God'sEye Logo" 
                  className="w-16 h-16 object-contain group-hover:opacity-80 transition-opacity duration-200"
                />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
                  God's Eye
                </h1>
                
              </div>
            </Link>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="flex items-center gap-2">
              <div className="md:hidden flex-shrink-0">
                <ThemeToggle />
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="
                  p-2 rounded-md text-gray-700 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-700/30 
                  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500
                  md:hidden
                "
                aria-label="Toggle navigation"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Desktop Navigation & Theme Toggle */}
              <div className="hidden md:flex items-center gap-2">
                <nav className="flex gap-2">
                  <Link to="/" className={navLinkClass('/')} onClick={() => setIsMenuOpen(false)}>Home</Link>
                  <Link to="/trending" className={navLinkClass('/trending')} onClick={() => setIsMenuOpen(false)}>Trending</Link>
                  <Link to="/movies" className={navLinkClass('/movies')} onClick={() => setIsMenuOpen(false)}>Movies</Link>
                  <Link to="/tvshows" className={navLinkClass('/tvshows')} onClick={() => setIsMenuOpen(false)}>TV Shows</Link>
                </nav>
                <div className="flex-shrink-0 hidden md:block">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel - Slides in from right */}
          <div className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-end p-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                  <span className="text-sm font-medium">Close menu</span>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                <Link to="/" className={navLinkClass('/')} onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/trending" className={navLinkClass('/trending')} onClick={() => setIsMenuOpen(false)}>Trending</Link>
                <Link to="/movies" className={navLinkClass('/movies')} onClick={() => setIsMenuOpen(false)}>Movies</Link>
                <Link to="/tvshows" className={navLinkClass('/tvshows')} onClick={() => setIsMenuOpen(false)}>TV Shows</Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};