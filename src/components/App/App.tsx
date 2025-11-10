import { useMemo, useRef, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import toast, { Toaster } from 'react-hot-toast';
import styles from './App.module.css';

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
    } catch (e: unknown) {
  if (e instanceof Error && e.name !== 'CanceledError' && e.message !== 'canceled') {
    console.error(e);
    setError('fetch_error');
  }
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={onSubmit} />

      {loading && <Loader />}
      {error && <ErrorMessage />}
      {canShowGrid && <MovieGrid movies={movies} onSelect={setSelected} />}

      <MovieModal movie={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
