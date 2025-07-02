// Movie details and watch page component with proper light/dark theme support
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Play, Film, Tv, Globe, Users } from 'lucide-react';
import { Movie, MovieDetails } from '../types/movie';
import { tmdbApi } from '../utils/tmdbApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ThemeToggle } from '../components/ThemeToggle';

export const WatchPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;

      setLoading(true);
      setError(null);

      try {
        // First try to get movie details
        let movieData: MovieDetails;
        try {
          movieData = await tmdbApi.getMovieDetails(parseInt(movieId));
          movieData.media_type = 'movie';
        } catch (movieError) {
          // If movie fails, try TV show
          movieData = await tmdbApi.getTVDetails(parseInt(movieId));
          movieData.media_type = 'tv';
        }

        setMovie(movieData);
      } catch (err) {
        setError('Failed to load movie details. Please try again.');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-300 dark:border-gray-700 transition-colors duration-300">
          <Film className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            Movie Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
            {error || 'The requested movie could not be found.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const title = movie.title || movie.name || 'Unknown Title';
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtime = movie.runtime || (movie.episode_run_time && movie.episode_run_time[0]);
  const mediaType = movie.media_type === 'tv' ? 'TV Show' : 'Movie';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-black/20 backdrop-blur-md border-b border-gray-300/30 dark:border-gray-700/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="absolute inset-0 z-0">
          <img
            src={tmdbApi.getBackdropUrl(movie.backdrop_path, 'w1280')}
            alt={title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-100/80 to-gray-100/40 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-900/40" />
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-2xl border border-gray-300/30 dark:border-gray-700/30 transition-colors duration-300">
                  {movie.poster_path ? (
                    <img
                      src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-16 h-16 text-gray-500 dark:text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Meta */}
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-medium rounded-full border border-amber-500/30">
                    {mediaType}
                  </span>
                  {movie.adult && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-full border border-red-500/30">
                      18+
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  {title}
                </h1>
                
                {movie.tagline && (
                  <p className="text-xl text-amber-700 dark:text-amber-400 italic mb-4 transition-colors duration-300">
                    "{movie.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  {year && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{year}</span>
                    </div>
                  )}
                  {runtime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{runtime} min</span>
                    </div>
                  )}
                  {movie.vote_average > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
                      <span>{rating}/10</span>
                      <span className="text-gray-500 dark:text-gray-500">({movie.vote_count?.toLocaleString()} votes)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm rounded-full border border-gray-300 dark:border-gray-600/50 transition-colors duration-300"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Overview</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg transition-colors duration-300">
                    {movie.overview}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.original_language && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center transition-colors duration-300">
                      <Globe className="w-4 h-4 mr-1" />
                      Original Language
                    </h4>
                    <p className="text-gray-900 dark:text-white transition-colors duration-300">{movie.original_language.toUpperCase()}</p>
                  </div>
                )}
                {movie.popularity && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center transition-colors duration-300">
                      <Users className="w-4 h-4 mr-1" />
                      Popularity
                    </h4>
                    <p className="text-gray-900 dark:text-white transition-colors duration-300">{Math.round(movie.popularity).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Video Player */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                  <Play className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" />
                  Watch Now
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-2xl border border-gray-300/30 dark:border-gray-700/30 transition-colors duration-300">
                  <iframe
                    src={`https://vidsrc.to/embed/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}`}
                    className="w-full h-full"
                    allowFullScreen
                    title={`Watch ${title}`}
                    frameBorder="0"
                  />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 transition-colors duration-300">
                  Video player powered by VidSrc. If the video doesn't load, try refreshing the page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};