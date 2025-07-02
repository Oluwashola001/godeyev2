// Hook for discovering movies with search functionality
import { useState, useEffect, useCallback, useRef } from 'react';
import { Movie, SearchResponse } from '../types/movie';
import { tmdbApi } from '../utils/tmdbApi';

interface UseDiscoverMoviesReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  isSearchMode: boolean;
  loadPage: (page: number) => void;
  searchMovies: (query: string) => void;
  clearSearch: () => void;
}

export const useDiscoverMovies = (): UseDiscoverMoviesReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  const debounceTimer = useRef<NodeJS.Timeout>();
  const abortController = useRef<AbortController>();

  const fetchMovies = useCallback(async (query: string, page: number = 1) => {
    if (abortController.current) {
      abortController.current.abort();
    }
    
    abortController.current = new AbortController();
    
    setLoading(true);
    setError(null);

    try {
      let response: SearchResponse;
      
      if (query.trim()) {
        response = await tmdbApi.searchMovies(query, page);
        setIsSearchMode(true);
      } else {
        response = await tmdbApi.discoverMovies(page);
        setIsSearchMode(false);
      }
      
      const filteredResults = response.results.filter(
        (item: Movie) => 
          item.title && 
          item.poster_path
      );

      // Add media_type for consistency
      const moviesWithType = filteredResults.map(movie => ({
        ...movie,
        media_type: 'movie' as const
      }));

      setMovies(moviesWithType);
      setCurrentPage(response.page);
      setTotalPages(Math.min(response.total_pages, 500));
      setTotalResults(response.total_results);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Failed to load movies. Please try again.');
        console.error('Fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setCurrentQuery(query);
      setCurrentPage(1);
      fetchMovies(query, 1);
    }, 300);
  }, [fetchMovies]);

  const loadPage = useCallback((page: number) => {
    if (page !== currentPage && !loading) {
      setCurrentPage(page);
      fetchMovies(currentQuery, page);
    }
  }, [currentPage, currentQuery, loading, fetchMovies]);

  const clearSearch = useCallback(() => {
    setCurrentQuery('');
    setCurrentPage(1);
    setIsSearchMode(false);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (abortController.current) {
      abortController.current.abort();
    }
    
    fetchMovies('', 1);
  }, [fetchMovies]);

  useEffect(() => {
    fetchMovies('', 1);
  }, [fetchMovies]);

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

  return {
    movies,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,
    isSearchMode,
    loadPage,
    searchMovies: debouncedSearch,
    clearSearch
  };
};