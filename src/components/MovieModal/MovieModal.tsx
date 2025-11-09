import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';
import { tmdbImg } from '../../services/movieService';

export interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement | null;

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  if (!movie || !modalRoot) return null;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Забороняємо скрол сторінки, поки відкрита модалка
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow; // відновлення
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const { title, overview, release_date, vote_average, backdrop_path } = movie;

  const modalContent = (
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={tmdbImg(backdrop_path, 'original') || ''}
          alt={title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{title}</h2>
          <p>{overview}</p>
          <p>
            <strong>Release Date:</strong> {release_date || '—'}
          </p>
          <p>
            <strong>Rating:</strong> {vote_average?.toFixed(1) ?? '—'}/10
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
}
