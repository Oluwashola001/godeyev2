// Search bar with proper light/dark theme support
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Film, Calendar } from 'lucide-react';
import { Movie } from '../types/movie';
import { tmdbApi } from '../utils/tmdbApi';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  loading?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  loading = false,
  placeholder = "Search for movies, TV shows, or keywords..."
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const abortController = useRef<AbortController>();

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    
    abortController.current = new AbortController();
    setLoadingSuggestions(true);

    try {
      const response = await tmdbApi.searchMulti(searchQuery, 1);
      
      // Filter and limit suggestions
      const filteredSuggestions = response.results
        .filter((item: Movie) => 
          (item.title || item.name) && 
          item.poster_path &&
          (item.media_type === 'movie' || item.media_type === 'tv')
        )
        .slice(0, 8); // Limit to 8 suggestions

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error fetching suggestions:', err);
      }
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  // Debounced suggestion fetching
  const debouncedFetchSuggestions = useCallback((searchQuery: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300); // 300ms debounce for suggestions only
  }, [fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Fetch suggestions but don't trigger search yet
    debouncedFetchSuggestions(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onClear();
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (movie: Movie) => {
    const movieTitle = movie.title || movie.name || '';
    setQuery(movieTitle);
    setShowSuggestions(false);
    
    // Open movie in new tab
    window.open(`/watch/${movie.id}`, '_blank');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Escape') {
        handleClear();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Focus search bar on '/' key press
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isFocused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  const getMovieYear = (movie: Movie) => {
    const date = movie.release_date || movie.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  const getMovieTitle = (movie: Movie) => {
    return movie.title || movie.name || 'Unknown Title';
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className={`
          relative flex items-center 
          bg-white/80 dark:bg-white/10 backdrop-blur-sm 
          border border-gray-300/50 dark:border-gray-300/20 rounded-2xl 
          transition-all duration-300 ease-out
          ${isFocused 
            ? 'ring-2 ring-amber-500/50 border-amber-500/50 shadow-lg shadow-amber-500/10' 
            : 'hover:border-gray-400/60 dark:hover:border-gray-300/40'
          }
        `}>
          <div className="flex items-center pl-4 pr-2">
            <Film className="w-5 h-5 text-amber-600 dark:text-amber-500 mr-3" />
            <Search className={`w-5 h-5 transition-colors duration-200 ${
              isFocused ? 'text-amber-600 dark:text-amber-500' : 'text-gray-500 dark:text-gray-400'
            }`} />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="
              flex-1 px-4 py-4 bg-transparent 
              text-gray-900 dark:text-white 
              placeholder-gray-500 dark:placeholder-gray-400 
              focus:outline-none text-lg
            "
            disabled={loading}
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="
                p-2 mr-2 rounded-full 
                hover:bg-gray-200/50 dark:hover:bg-gray-200/20 
                transition-colors duration-200 group
              "
              aria-label="Clear search"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            </button>
          )}

          {loading && (
            <div className="pr-4">
              <div className="w-5 h-5 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {/* Search hint */}
      {!isFocused && !query && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 pointer-events-none">
          Press <kbd className="px-2 py-1 bg-gray-200/50 dark:bg-gray-200/20 rounded text-xs">/</kbd> to search
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
        <div 
          ref={suggestionsRef}
          className="
            absolute top-full left-0 right-0 mt-2 
            bg-white/95 dark:bg-gray-800/95 
            backdrop-blur-md border border-gray-300/50 dark:border-gray-300/20 
            rounded-xl shadow-2xl shadow-black/20 z-50 overflow-hidden
          "
        >
          {loadingSuggestions ? (
            <div className="p-4 text-center">
              <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <div className="w-4 h-4 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <span className="text-sm">Loading suggestions...</span>
              </div>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {suggestions.map((movie, index) => {
                const title = getMovieTitle(movie);
                const year = getMovieYear(movie);
                const mediaType = movie.media_type === 'tv' ? 'TV Show' : 'Movie';
                
                return (
                  <button
                    key={`${movie.id}-${movie.media_type}`}
                    onClick={() => handleSuggestionClick(movie)}
                    className={`
                      w-full flex items-center space-x-3 p-3 text-left transition-colors duration-150
                      ${index === selectedIndex 
                        ? 'bg-amber-100 dark:bg-amber-500/10' 
                        : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                      }
                      ${index !== suggestions.length - 1 ? 'border-b border-gray-200/50 dark:border-gray-700/30' : ''}
                    `}
                  >
                    {/* Poster Thumbnail */}
                    <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {movie.poster_path ? (
                        <img
                          src={tmdbApi.getImageUrl(movie.poster_path, 'w92')}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Movie Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {title}
                        </h4>
                        <span className="flex-shrink-0 px-2 py-0.5 bg-amber-200 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs rounded-full">
                          {mediaType}
                        </span>
                      </div>
                      {year && (
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{year}</span>
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    {movie.vote_average > 0 && (
                      <div className="flex-shrink-0 flex items-center space-x-1 text-amber-600 dark:text-amber-500">
                        <span className="text-sm font-medium">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer hint */}
          <div className="px-3 py-2 bg-gray-100/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Press <kbd className="px-1 py-0.5 bg-gray-200/50 dark:bg-gray-700/50 rounded text-xs">Enter</kbd> to search or click a suggestion to watch
            </p>
          </div>
        </div>
      )}
    </div>
  );
};