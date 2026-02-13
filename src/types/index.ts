export type { FilmData } from '../data/films';

export type Screen =
  | 'landing'
  | 'signup-basic'
  | 'signup-genres'
  | 'home'
  | 'movie-detail'
  | 'playback';

export interface UserData {
  name: string;
  dateOfBirth: string;
  email: string;
  password: string;
  genres: string[];
}

// Keep the legacy Movie type alias so PlaybackScreen / FeedbackToast still compile
export type { FilmData as Movie } from '../data/films';
