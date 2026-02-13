import { useState } from 'react';
import { Film, Check } from 'lucide-react';
import { ImageWithFallback } from '@/components';
import { cn } from '@/helpers';
import styles from './SignupGenrePreferences.module.css';

interface SignupGenrePreferencesProps {
  onSubmit: (genres: string[]) => void;
  onSkip: () => void;
}

const genres = [
  { name: 'Action', image: 'https://images.unsplash.com/photo-1761948245185-fc300ad20316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjM4NzY3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Comedy', image: 'https://images.unsplash.com/photo-1732029541807-1eede3bec4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzYzODI3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Horror', image: 'https://images.unsplash.com/photo-1630338679229-99fb150fbf88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBtb3ZpZSUyMGRhcmt8ZW58MXx8fHwxNzYzODg0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Romance', image: 'https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwY291cGxlJTIwY2luZW1hfGVufDF8fHx8MTc2MzkyOTM3NXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Sci-Fi', image: 'https://images.unsplash.com/photo-1644772310791-deb96e24ee65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzYzOTAwMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Drama', image: 'https://images.unsplash.com/photo-1715322608224-a9efaeeffaf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMHRoZWF0cmljYWx8ZW58MXx8fHwxNzYzOTI5Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Thriller', image: 'https://images.unsplash.com/photo-1563905463861-7d77975b3a44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMHN1c3BlbnNlJTIwZGFya3xlbnwxfHx8fDE3NjM4MTk2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Documentary', image: 'https://images.unsplash.com/photo-1672274168497-a75b7b8298b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGNhbWVyYSUyMGZpbG18ZW58MXx8fHwxNzYzOTI5Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
];

export function SignupGenrePreferences({ onSubmit, onSkip }: SignupGenrePreferencesProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleContinue = () => {
    onSubmit(selectedGenres);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Film className={styles.logoIcon} aria-hidden="true" />
          <h1 className={styles.logoTitle}>FilmSlate</h1>
        </div>
        <h2 className={styles.heading}>What kinds of films do you love?</h2>
        <p className={styles.subheading}>Select your favourite genres to get personalised recommendations</p>
        <div className={styles.genreGrid}>
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.name);
            return (
              <button
                key={genre.name}
                onClick={() => toggleGenre(genre.name)}
                aria-pressed={isSelected}
                className={cn(styles.genreButton, "group")}
              >
                <ImageWithFallback
                  src={genre.image}
                  alt={genre.name}
                  className={styles.genreImage}
                />
                <div
                  className={cn(
                    isSelected ? styles.genreOverlaySelected : styles.genreOverlay,
                    !isSelected && styles.genreOverlayHover
                  )}
                />
                <div className={styles.genreLabelContainer}>
                  <span className={styles.genreName}>{genre.name}</span>
                  {isSelected && (
                    <div className={styles.checkBadge}>
                      <Check className={styles.checkIcon} aria-hidden="true" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <div className={styles.actions}>
          <button
            onClick={handleContinue}
            disabled={selectedGenres.length === 0}
            className={styles.continueButton}
          >
            Continue
          </button>
          <button onClick={onSkip} className={styles.skipButton}>
            Skip this step
          </button>
        </div>
      </div>
    </main>
  );
}

export default SignupGenrePreferences;
