// Enhanced TMDB API with discover endpoints
import { SearchResponse, Movie, MovieDetails } from '../types/movie';

const API_KEY = '8265bd1679663a7ea12ac168da84d2e8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbApi = {
  // Search for movies and TV shows
  searchMulti: async (query: string, page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Search for movies only
  searchMovies: async (query: string, page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Search for TV shows only
  searchTVShows: async (query: string, page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching TV shows:', error);
      throw error;
    }
  },

  // Get trending movies and TV shows with pagination
  getTrending: async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/trending/all/${timeWindow}?api_key=${API_KEY}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trending:', error);
      throw error;
    }
  },

  // Discover movies
  discoverMovies: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error discovering movies:', error);
      throw error;
    }
  },

  // Discover TV shows
  discoverTVShows: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await fetch(
        `${BASE_URL}/discover/tv?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc&include_adult=false`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error discovering TV shows:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (id: number): Promise<MovieDetails> => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Get TV show details
  getTVDetails: async (id: number): Promise<MovieDetails> => {
    try {
      const response = await fetch(
        `${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching TV details:', error);
      throw error;
    }
  },

  // Helper functions for image URLs
  getImageUrl: (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder-movie.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getBackdropUrl: (path: string | null, size: string = 'w1280'): string => {
    if (!path) return '/placeholder-backdrop.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};