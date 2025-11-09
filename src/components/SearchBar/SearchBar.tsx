import { useActionState } from 'react';
import toast from 'react-hot-toast';
import styles from './SearchBar.module.css';

export interface SearchBarProps {
  onSubmit: (query: string) => void;
}

// Обробка форми 
export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [, formAction] = useActionState(
    async (_prev: null, formData: FormData) => {
      const raw = formData.get('query');
      const query = (typeof raw === 'string' ? raw : '').trim();

      if (!query) {
        toast.error('Please enter your search query.');
        return null;
      }

      onSubmit(query);
      return null;
    },
    null
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form className={styles.form} action={formAction}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
