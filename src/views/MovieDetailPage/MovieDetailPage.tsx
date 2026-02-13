import { ArrowLeft, Play, Clock, Calendar, Award } from 'lucide-react';
import type { FilmData } from '@/types';
import styles from './MovieDetailPage.module.css';

interface MovieDetailPageProps {
  film: FilmData;
  onBack: () => void;
  onPlay: () => void;
}

export function MovieDetailPage({ film, onBack, onPlay }: MovieDetailPageProps) {
  return (
    <main className={styles.main}>
      <button onClick={onBack} className={styles.backButton}>
        <ArrowLeft className={styles.backIcon} aria-hidden="true" />
        Back
      </button>
      <div className={styles.heroContainer}>
        <img src={film.image} alt={film.title} className={styles.heroImage} />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className={styles.heroInner}>
            <h1 className={styles.title}>{film.title}</h1>
            <button onClick={onPlay} className={styles.playButton}>
              <Play className={styles.playIcon} fill="white" aria-hidden="true" />
              Play
            </button>
            <div className={styles.details}>
              <div className={styles.metaBar}>
                <span className={styles.metaItem} aria-label={`Released in ${film.releaseYear}`}>
                  <Calendar className={styles.metaIcon} aria-hidden="true" />
                  <span aria-hidden="true">{film.releaseYear}</span>
                </span>
                <span className={styles.metaItem} aria-label={`Runtime ${film.runtime} minutes`}>
                  <Clock className={styles.metaIcon} aria-hidden="true" />
                  <span aria-hidden="true">{film.runtime} min</span>
                </span>
                <span aria-label={`Genres: ${film.genres.join(', ')}`}>
                  <span aria-hidden="true">{film.genres.join(' · ')}</span>
                </span>
              </div>
              <div>
                <h3 className={styles.aboutHeading}>About</h3>
                <p className={styles.aboutText}>{film.synopsis}</p>
              </div>
              {film.awards.length > 0 && (
                <div>
                  <h3 className={styles.awardsHeading}>
                    <Award className={styles.metaIcon} aria-hidden="true" /> Recognition
                  </h3>
                  <ul className={styles.awardsList}>
                    {film.awards.map(award => (
                      <li key={award} className={styles.awardItem}>{award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MovieDetailPage;
