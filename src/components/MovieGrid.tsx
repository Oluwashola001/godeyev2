// Updated movie grid component with improved responsive layout
import React from 'react';
import { Film } from 'lucide-react';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './LoadingSpinner';

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  onMovieClick?: (movie: Movie) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading,
  onMovieClick
}) => {
  if (movies.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 dark:text-gray-500">
          <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No movies found</h3>
          <p>Try searching for something else</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Movie Grid - Improved responsive layout */}
      <div className="
        grid gap-4 md:gap-6
        grid-cols-[repeat(auto-fit,minmax(160px,1fr))]
        sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]
        md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
        lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]
        xl:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]
      ">
        {movies.map((movie) => (
          <MovieCard
            key={`${movie.id}-${movie.media_type}`}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}

        {/* Loading skeletons */}
        {loading && (
          Array.from({ length: 20 }).map((_, index) => (
            <MovieCardSkeleton key={`skeleton-${index}`} />
          ))
        )}
      </div>
    </div>
  );
};