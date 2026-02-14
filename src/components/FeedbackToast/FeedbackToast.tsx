import { useEffect, useRef } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import type { Movie } from '@/types';
import styles from './FeedbackToast.module.css';

interface FeedbackToastProps {
  movieDetails: Movie;
  feedbackGiven: 'up' | 'down' | null;
  onFeedback: (type: 'up' | 'down') => void;
  onClose: () => void;
}

export function FeedbackToast({ movieDetails, feedbackGiven, onFeedback, onClose }: FeedbackToastProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      role="alertdialog"
      aria-label="Feedback"
      tabIndex={-1}
      className={styles.toast}
    >
      {feedbackGiven === null ? (
        <>
          <p className={styles.question}>Did you enjoy {movieDetails.title}?</p>
          <div className={styles.buttonGroup}>
            <button onClick={() => onFeedback('up')} className={styles.feedbackButton}>
              <ThumbsUp className={styles.feedbackIcon} aria-hidden="true" />
              Yes
            </button>
            <button onClick={() => onFeedback('down')} className={styles.feedbackButton}>
              <ThumbsDown className={styles.feedbackIcon} aria-hidden="true" />
              No
            </button>
          </div>
        </>
      ) : (
        <div className={styles.thankYou}>
          <p className={styles.thankYouText}>Thank you for your feedback!</p>
        </div>
      )}
      <button onClick={onClose} aria-label="Close" className={styles.closeButton}>
        <X className={styles.closeIcon} aria-hidden="true" />
      </button>
    </div>
  );
}

export default FeedbackToast;
