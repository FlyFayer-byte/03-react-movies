import axios from 'axios';
import type { Movie } from '../types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

if (!token) {
  console.warn('VITE_TMDB_TOKEN is not set. Please add it to .env.local');
}

const client = axios.create({
  baseURL: TMDB_BASE_URL,
});

export interface TmdbSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface FetchMoviesParams {
  query: string;
  page?: number;
  signal?: AbortSignal;
}

export async function fetchMovies({
  query,
  page = 1,
  signal,
}: FetchMoviesParams): Promise<TmdbSearchResponse> {
  const config = {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  } as const;

  const response = await client.get<TmdbSearchResponse>('/search/movie', config);
  return response.data;
}

export function tmdbImg(path: string | null, size: 'w500' | 'original' = 'w500') {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
