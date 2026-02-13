import { Film } from 'lucide-react';
import styles from './LandingScreen.module.css';

interface LandingScreenProps {
  onCreateAccount: () => void;
}

export function LandingScreen({ onCreateAccount }: LandingScreenProps) {
  return (
    <main className={styles.main}>
      <div className={styles.backgroundContainer}>
        <img
          src="https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwY291cGxlJTIwY2luZW1hfGVufDF8fHx8MTc2MzkyOTM3NXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt=""
          className={styles.backgroundImage}
        />
        <div className={styles.backgroundOverlay} />
      </div>
      <button
        onClick={onCreateAccount}
        className={styles.loginButton}
      >
        Log in
      </button>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <Film className={styles.logoIcon} aria-hidden="true" />
          <h1 className={styles.logoTitle}>FilmSlate</h1>
        </div>
        <h2 className={styles.heading}>
          Discover unforgettable indie films, curated for you
        </h2>
        <p className={styles.description}>
          Stream bold, independent cinema from visionary filmmakers around the world.
          Experience stories that challenge, inspire, and stay with you long after the credits roll.
        </p>
        <p className={styles.trialInfo}>
          Explore FilmSlate for free with a 7-day trial, then subscribe for £9.99 per month. Cancel anytime.
        </p>
        <button
          onClick={onCreateAccount}
          className={styles.createAccountButton}
        >
          Create an account
        </button>
      </div>
    </main>
  );
}

export default LandingScreen;
