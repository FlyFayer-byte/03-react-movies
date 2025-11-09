import { useMemo, useRef, useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import MovieGrid from './components/MovieGrid/MovieGrid';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import MovieModal from './components/MovieModal/MovieModal';
import type { Movie } from './types/movie';
import { fetchMovies } from './services/movieService';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Movie | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const canShowGrid = useMemo(
    () => !loading && !error && movies.length > 0,
    [loading, error, movies]
  );

  const onSubmit = async (query: string) => {
    // Скасувати попередній запит, очистити попередні фільми
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setMovies([]);
    setError(null);
    setLoading(true);

    try {
      const data = await fetchMovies({
        query,
        page: 1,
        signal: abortRef.current.signal,
      });
      if (!data.results.length) {
        toast.error('No movies found for your request.');
      }
      setMovies(data.results);
    } catch (e) {
      if (
        (e as any)?.name !== 'CanceledError' &&
        (e as any)?.message !== 'canceled'
      ) {
        console.error(e);
        setError('fetch_error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <SearchBar onSubmit={onSubmit} />

      {loading && <Loader />}
      {error && <ErrorMessage />}
      {canShowGrid && <MovieGrid movies={movies} onSelect={setSelected} />}

      <MovieModal movie={selected} onClose={() => setSelected(null)} />
    </>
  );
}
