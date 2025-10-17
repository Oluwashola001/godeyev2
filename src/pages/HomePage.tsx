// Homepage with improved layout and sticky header support
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { MovieGrid } from '../components/MovieGrid';
import { PaginationBar } from '../components/PaginationBar';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { Movie } from '../types/movie';

export const HomePage: React.FC = () => {
  const {
    movies,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,
    searchMovies,
    loadPage,
    clearSearch,
    isSearchMode
  } = useMovieSearch();

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    // Open movie details in new tab
    const movieId = movie.id;
    window.open(`/watch/${movieId}`, '_blank');
  };

  const handlePageChange = (page: number) => {
    loadPage(page);
    // Smooth scroll to top, accounting for sticky header
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
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Discover Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-500">
                Favorite Movie
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto transition-colors duration-300">
              Search through millions of movies and TV shows. Find exactly what you're looking for with God'seye.
            </p>

            {/* Search Bar */}
            <SearchBar
              onSearch={searchMovies}
              onClear={clearSearch}
              loading={loading}
            />

            {/* Search Results Info */}
            {totalResults > 0 && (
              <div className="mt-6 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <p className="text-sm">
                  {isSearchMode ? 'Found' : 'Showing'} {totalResults.toLocaleString()} {isSearchMode ? 'results' : 'trending movies'}
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
<footer className="relative z-10 bg-gray-900 dark:bg-gray-950 py-4 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Brand Section */}
    <div className="flex flex-col items-center justify-center mb-4">
      <div className="flex items-center -mt-3.5 ">
        <span className="text-3xl md:text-4xl font-bold text-gray-400">God'sEyeM</span>
        <img 
          src="/logo.png" 
          alt="God'sEye Logo" 
          className="w-20 h-20 md:w-20 md:h-20 object-contain -mx-2.5"
        />
        <span className="text-4xl md:text-5xl font-bold text-gray-400">vies</span>
      </div>
      <p className="text-gray-500 text-sm md:text-base -mt-5">
        Bringing your favorite movies closer. Free forever. Zero ads.
      </p>
    </div>

    {/* Copyright Section */}
    <div className="text-center">
      <p className="text-white text-base md:text-lg mb-4 py-4">
        Copyright © 2025 God'sEye - All Rights Reserved.
      </p>
      <p className="text-gray-500 text-sm md:text-base max-w-3xl mx-auto mb-4">
        Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.
      </p>
    </div>
  </div>
</footer>
    </div>
  );
};