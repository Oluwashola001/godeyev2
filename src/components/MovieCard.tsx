// Movie card with consistent height and improved responsive design
import React, { useState } from 'react';
import { Star, Calendar, Play, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { tmdbApi } from '../utils/tmdbApi';

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = movie.title || movie.name || 'Unknown Title';
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const mediaType = movie.media_type === 'tv' ? 'TV Show' : 'Movie';

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const handleCardClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  return (
    <div 
      className="
        group relative 
        bg-white/80 dark:bg-gray-900/40 
        backdrop-blur-sm rounded-xl overflow-hidden 
        border border-gray-300/30 dark:border-gray-700/30 
        hover:border-amber-500/50 transition-all duration-300 ease-out
        hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2
        cursor-pointer
        h-full flex flex-col
      "
      onClick={handleCardClick}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
        {!imageError ? (
          <img
            src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
            alt={title}
            className={`
              w-full h-full object-cover transition-all duration-500
              group-hover:scale-110 
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="w-12 h-12 mx-auto mb-2 opacity-50">📽️</div>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}

        {/* Overlay with play button */}
        <div className="
          absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 flex items-center justify-center
        ">
          <div className="
            p-3 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-500/30
            group-hover:scale-110 transition-transform duration-300
          ">
            <Play className="w-6 h-6 text-amber-400 fill-current" />
          </div>
        </div>

        {/* Rating badge */}
        {movie.vote_average > 0 && (
          <div className="
            absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm 
            rounded-lg flex items-center space-x-1
          ">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="text-xs text-white font-medium">{rating}</span>
          </div>
        )}

        {/* Media type badge */}
        <div className="
          absolute top-3 left-3 px-2 py-1 bg-amber-500/20 backdrop-blur-sm 
          rounded-lg border border-amber-500/30
        ">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{mediaType}</span>
        </div>
      </div>

      {/* Movie Info - Flexible height */}
      <div className="p-4 space-y-2 flex-grow flex flex-col">
        <h3 className="
          text-gray-900 dark:text-white font-semibold text-sm leading-tight line-clamp-2
          group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300
          flex-shrink-0
        ">
          {title}
        </h3>

        {year && (
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs flex-shrink-0">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{year}</span>
          </div>
        )}

        {movie.overview && (
          <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-3 flex-grow">
            {movie.overview}
          </p>
        )}

        {/* Additional info on hover */}
        <div className="
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          pt-2 border-t border-gray-300/50 dark:border-gray-700/50
          flex-shrink-0
        ">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              {movie.vote_count > 0 && `${movie.vote_count.toLocaleString()} votes`}
            </span>
            <div className="flex items-center text-amber-600 dark:text-amber-400">
              <Info className="w-3 h-3 mr-1" />
              <span>Details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};