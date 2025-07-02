// Movies page with sticky header support
import React from 'react';
import { Film } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { MovieGrid } from '../components/MovieGrid';
import { PaginationBar } from '../components/PaginationBar';
import { useDiscoverMovies } from '../hooks/useDiscoverMovies';
import { Movie } from '../types/movie';

export const MoviesPage: React.FC = () => {
  const {
    movies,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,
    loadPage,
    searchMovies,
    clearSearch,
    isSearchMode
  } = useDiscoverMovies();

  const handleMovieClick = (movie: Movie) => {
    const movieId = movie.id;
    window.open(`/watch/${movieId}`, '_blank');
  };

  const handlePageChange = (page: number) => {
    loadPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1' class='dark:fill-white'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Film className="w-12 h-12 text-amber-600 dark:text-amber-500" />
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                Movies
              </h2>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto transition-colors duration-300">
              Explore the world of cinema. From blockbusters to indie gems, find your next favorite movie.
            </p>

            {/* Search Bar */}
            <SearchBar
              onSearch={searchMovies}
              onClear={clearSearch}
              loading={loading}
              placeholder="Search movies..."
            />

            {/* Results Info */}
            {totalResults > 0 && (
              <div className="mt-6 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <p className="text-sm">
                  {isSearchMode ? 'Found' : 'Showing'} {totalResults.toLocaleString()} {isSearchMode ? 'results' : 'movies'}
                  {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <section className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 rounded-xl p-4 text-center transition-colors duration-300">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          </section>
        )}

        {/* Movie Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <MovieGrid
              movies={movies}
              loading={loading}
              onMovieClick={handleMovieClick}
            />
          </div>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-7xl mx-auto">
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/40 dark:bg-black/40 backdrop-blur-md border-t border-gray-300/30 dark:border-gray-700/30 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
            Powered by{' '}
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200"
            >
              The Movie Database (TMDB)
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};