import { X } from 'lucide-react';
import type { Movie } from '@/types';
import styles from './PlaybackScreen.module.css';

interface PlaybackScreenProps {
  movie: Movie;
  onExit: () => void;
}

export function PlaybackScreen({ movie, onExit }: PlaybackScreenProps) {
  return (
    <main className={styles.main}>
      <button onClick={onExit} aria-label="Close" className={styles.closeButton}>
        <X className={styles.closeIcon} aria-hidden="true" />
      </button>
      <div className={styles.videoContainer}>
        <img src={movie.image} alt={movie.title} className={styles.posterImage} />
        <div className={styles.overlay}>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{movie.title}</h2>
            <p className={styles.nowPlaying}>Now Playing</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PlaybackScreen;
