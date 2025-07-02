// Extended types for movie details and additional data
export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
  original_language: string;
  popularity: number;
  adult?: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime?: number;
  episode_run_time?: number[];
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  imdb_id?: string;
  homepage?: string;
  production_companies?: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  production_countries?: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages?: {
    iso_639_1: string;
    name: string;
  }[];
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}