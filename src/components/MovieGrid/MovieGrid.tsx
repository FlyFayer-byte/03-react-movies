import type { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';
import { tmdbImg } from '../../services/movieService';

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies.length) return null;

  return (
    <ul className={css.grid}>
      {movies.map(movie => (
        <li key={movie.id}>
          <div
            className={css.card}
            onClick={() => onSelect(movie)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onSelect(movie)}
          >
            {movie.poster_path ? (
              <img
                className={css.image}
                src={tmdbImg(movie.poster_path, 'w500')}
                alt={movie.title}
                loading="lazy"
              />
            ) : (
              <div className={css.placeholder}>
                <p>No image</p>
              </div>
            )}
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
