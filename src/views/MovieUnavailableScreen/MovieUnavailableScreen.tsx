import { ArrowRight } from 'lucide-react';
import type { FilmData } from '@/types';
import type { Recommendation } from '@/helpers';
import { Card, CardContent, MaterialCard, Button } from '@/components';
import styles from './MovieUnavailableScreen.module.css';

interface MovieUnavailableScreenProps {
  film: FilmData;
  recommendations: Recommendation[];
  onSelectFilm: (film: FilmData) => void;
  onReadEditorial: (film: FilmData) => void;
  onViewAll: () => void;
}

export function MovieUnavailableScreen({ film, recommendations, onSelectFilm, onReadEditorial, onViewAll }: MovieUnavailableScreenProps) {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.heading}>This film is no longer available</h1>
          <p className={styles.subtitle}>
            <strong>{film.title}</strong> has left our rotating 30-day library.{' '}
            <a href="#" className={styles.learnMore}>Learn more</a>
          </p>
          <div className={styles.cardWrapper}>
            <div className={styles.cardInner}>
              <MaterialCard thumbnail={film.image} title={film.title} subtitle="No longer playing on FilmSlate" horizontal outline />
            </div>
          </div>
          <section aria-labelledby="recs-heading" className={styles.recsSection}>
            <h2 id="recs-heading" className={styles.recsHeading}>Try these instead</h2>
            <p>These films are similar to the one you were looking for.</p>
          </section>
        </div>
        <div className={styles.recsGrid}>
          {recommendations.map(({ film: recFilm, reason }) => (
            <Card key={recFilm.id} className={styles.recCard}>
              <img src={recFilm.image} alt={recFilm.title} className={styles.recImage} />
              <CardContent className={styles.recContent}>
                <p className={styles.recTitle}>{recFilm.title}</p>
                <p className={styles.recDescription}>{recFilm.description}</p>
                <p className={styles.recReason}>{reason}</p>
                <div className={styles.recActions}>
                  <Button variant="ghost" onClick={() => onReadEditorial(recFilm)}>Read Editorial</Button>
                  <Button variant="default" onClick={() => onSelectFilm(recFilm)}>Watch</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onViewAll}>
            View more films <ArrowRight className={styles.viewMoreIcon} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </main>
  );
}

export default MovieUnavailableScreen;
