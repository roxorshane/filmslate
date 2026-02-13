import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import type { UserData } from '@/types';
import type { FilmData } from '@/data';
import { ALL_FILMS, HERO_FILM_IDS, GRID_FILM_IDS } from '@/data';
import { cn } from '@/helpers';
import styles from './HomeScreen.module.css';

interface HomeScreenProps {
  userData: UserData;
  onMovieSelect: (film: FilmData) => void;
  onChooseGenresClick: () => void;
  onCritiquesClick?: () => void;
}

type Category = 'All' | 'Trending' | 'Leaving Soon' | 'Highly Acclaimed' | 'Most Liked';

const HERO_MOVIES = ALL_FILMS.filter(f => HERO_FILM_IDS.includes(f.id));
const MOVIE_GRID = ALL_FILMS.filter(f => GRID_FILM_IDS.includes(f.id));

const CATEGORIES: Category[] = ['All', 'Trending', 'Leaving Soon', 'Highly Acclaimed', 'Most Liked'];

export function HomeScreen({ userData, onMovieSelect, onChooseGenresClick, onCritiquesClick }: HomeScreenProps) {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const hasGenres = userData.genres.length > 0;

  useEffect(() => {
    const getNextHeroIndex = () => {
      const nextHeroIndex = (currentHeroIndex + 1) % (HERO_MOVIES.length);
      console.log("Hero", { currentHeroIndex, nextHeroIndex, modulo: HERO_MOVIES.length });
      return nextHeroIndex;
    };
    const timer = setInterval(() => {
      setCurrentHeroIndex(getNextHeroIndex());
    }, 5000);
    return () => clearInterval(timer);
  }, [currentHeroIndex]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoContainer}>
            <Film className={styles.logoIcon} aria-hidden="true" />
            <h1 className={styles.logoTitle}>FilmSlate</h1>
          </div>
          <div className={styles.headerRight}>
            {onCritiquesClick && (
              <button onClick={onCritiquesClick} className={styles.editorialButton}>Editorial</button>
            )}
            <div className={styles.avatar} />
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <section aria-label="Featured films" className={styles.heroSection}>
          {HERO_MOVIES.map((movie, index) => (
            <div
              key={movie.id}
              className={cn(
                styles.heroSlide,
                index === currentHeroIndex ? styles.heroSlideVisible : styles.heroSlideHidden
              )}
            >
              <div className={styles.heroSlideInner}>
                <img src={movie.image} alt={movie.title} className={styles.heroImage} />
                <div className={styles.heroGradient} />
                <div className={styles.heroContent}>
                  <div className={styles.heroContentInner}>
                    {index === 0 && hasGenres && (
                      <span className={styles.forYouBadge}>For You</span>
                    )}
                    <h2 className={styles.heroTitle}>{movie.title}</h2>
                    <button onClick={() => onMovieSelect(movie)} className={styles.watchNowButton}>Watch Now</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className={styles.heroDots}>
            {HERO_MOVIES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentHeroIndex ? "true" : undefined}
                className={cn(
                  styles.heroDot,
                  index === currentHeroIndex ? styles.heroDotActive : styles.heroDotInactive
                )}
              />
            ))}
          </div>
        </section>
        {hasGenres ? (
          <section aria-labelledby="for-you-heading" className={styles.forYouSection}>
            <h3 id="for-you-heading" className={styles.forYouHeading}>For You</h3>
            <div className={styles.forYouScroller}>
              {MOVIE_GRID.slice(0, 5).map((movie) => (
                <button key={movie.id} onClick={() => onMovieSelect(movie)} className={cn(styles.forYouCard, "group")}>
                  <div className={styles.cardPoster}>
                    <img src={movie.image} alt={movie.title} className={styles.cardImage} />
                  </div>
                  <p className={styles.cardTitle}>{movie.title}</p>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section aria-label="Genre preferences" className={styles.genrePrompt}>
            <p className={styles.genrePromptText}>Select your favourite genres to get personalised recommendations</p>
            <button onClick={onChooseGenresClick} className={styles.chooseGenresButton}>Choose Genres</button>
          </section>
        )}
        <nav aria-label="Film categories" className={styles.categoryNav}>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                styles.categoryButton,
                selectedCategory === category ? styles.categoryButtonActive : styles.categoryButtonInactive
              )}
            >
              {category}
            </button>
          ))}
        </nav>
        <section aria-label="Film library" className={styles.filmGrid}>
          {MOVIE_GRID.map((movie) => (
            <button key={movie.id} onClick={() => onMovieSelect(movie)} className={cn(styles.filmGridCard, "group")}>
              <div className={styles.cardPoster}>
                <img src={movie.image} alt={movie.title} className={styles.cardImage} />
              </div>
              <p className={styles.filmGridTitle}>{movie.title}</p>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

export default HomeScreen;
