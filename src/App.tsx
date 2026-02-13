import { useState, useEffect } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { SignupBasicInfo } from './components/SignupBasicInfo';
import { SignupGenrePreferences } from './components/SignupGenrePreferences';
import { HomeScreen } from './components/HomeScreen';
import { MovieDetailPage } from './components/MovieDetailPage';
import { MovieUnavailableScreen } from './components/MovieUnavailableScreen';
import { PlaybackScreen } from './components/PlaybackScreen';
import { PaymentDialog } from './components/PaymentDialog';
import { FeedbackToast } from './components/FeedbackToast';
import { ALL_FILMS, getFilmById, isFilmAvailable, getAvailableFilms } from './data/films';
import type { FilmData } from './data/films';
import { getRecommendations } from './lib/rag';
import type { Recommendation } from './lib/rag';

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
export type Movie = FilmData;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    dateOfBirth: '',
    email: '',
    password: '',
    genres: [],
  });
  const [selectedFilm, setSelectedFilm] = useState<FilmData | null>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  // Auth / session state (prototype: ToS acceptance = "logged in")
  const [tosAccepted, setTosAccepted] = useState(false);
  const [trialActivated, setTrialActivated] = useState(false);
  const [pendingAction, setPendingAction] = useState<'play' | 'genres' | null>(null);

  // On mount: check for ?mid= query parameter and navigate directly to that film
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mid = params.get('mid');
    if (!mid) return;

    const id = parseInt(mid, 10);
    if (isNaN(id)) return;

    const film = getFilmById(id);
    if (!film) return;

    const available = isFilmAvailable(film);
    setSelectedFilm(film);
    setIsUnavailable(!available);

    if (!available) {
      const recs = getRecommendations(film, getAvailableFilms());
      setRecommendations(recs);
    }

    setCurrentScreen('movie-detail');
  }, []);

  const navigateToFilm = (film: FilmData) => {
    const available = isFilmAvailable(film);
    setSelectedFilm(film);
    setIsUnavailable(!available);

    if (!available) {
      const recs = getRecommendations(film, getAvailableFilms());
      setRecommendations(recs);
    } else {
      setRecommendations([]);
    }

    setCurrentScreen('movie-detail');
  };

  const handleCreateAccount = () => setCurrentScreen('signup-basic');

  const handleBasicInfoSubmit = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
    setTosAccepted(true);
    if (pendingAction === 'play') {
      // Return to the film they were trying to watch and trigger payment
      setPendingAction(null);
      setCurrentScreen('movie-detail');
      setShowPaymentDialog(true);
    } else {
      // 'genres' pending or normal signup flow — proceed to genre selection
      setPendingAction(null);
      setCurrentScreen('signup-genres');
    }
  };

  const handleChooseGenresClick = () => {
    if (!tosAccepted) {
      setPendingAction('genres');
      setCurrentScreen('signup-basic');
      return;
    }
    setCurrentScreen('signup-genres');
  };

  const handleGenreSubmit = (genres: string[]) => {
    setUserData(prev => ({ ...prev, genres }));
    setCurrentScreen('home');
  };

  const handleSkipGenres = () => setCurrentScreen('home');

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedFilm(null);
    setIsUnavailable(false);
    setRecommendations([]);
  };

  const handleNavigateToCritiques = () => {
    window.location.href = '/substack';
  };

  const handleNavigateToEditorial = (film: FilmData) => {
    window.open(`/substack?id=${film.id}`, '_blank');
  };

  const handlePlayMovie = () => {
    if (!tosAccepted) {
      setPendingAction('play');
      setCurrentScreen('signup-basic');
      return;
    }
    if (!trialActivated) {
      setShowPaymentDialog(true);
      return;
    }
    // Trial already active — play immediately
    setCurrentScreen('playback');
  };

  const handlePaymentConfirm = () => {
    setTrialActivated(true);
    setShowPaymentDialog(false);
    setCurrentScreen('playback');
  };

  const handlePaymentCancel = () => setShowPaymentDialog(false);

  const handleExitPlayback = () => {
    setCurrentScreen('home');
    setShowFeedbackToast(true);
    setFeedbackGiven(null);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedbackGiven(type);
    setTimeout(() => {
      setShowFeedbackToast(false);
      setFeedbackGiven(null);
    }, 2000);
  };

  const handleCloseFeedback = () => {
    setShowFeedbackToast(false);
    setFeedbackGiven(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentScreen === 'landing' && (
        <LandingScreen onCreateAccount={handleCreateAccount} />
      )}

      {currentScreen === 'signup-basic' && (
        <SignupBasicInfo
          onSubmit={handleBasicInfoSubmit}
          context={pendingAction ?? 'signup'}
        />
      )}

      {currentScreen === 'signup-genres' && (
        <SignupGenrePreferences
          onSubmit={handleGenreSubmit}
          onSkip={handleSkipGenres}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          userData={userData}
          onMovieSelect={navigateToFilm}
          onChooseGenresClick={handleChooseGenresClick}
          onCritiquesClick={handleNavigateToCritiques}
        />
      )}

      {currentScreen === 'movie-detail' && selectedFilm && (
        isUnavailable ? (
          <MovieUnavailableScreen
            film={selectedFilm}
            recommendations={recommendations}
            onSelectFilm={navigateToFilm}
            onReadEditorial={handleNavigateToEditorial}
            onViewAll={handleBackToHome}
          />
        ) : (
          <MovieDetailPage
            film={selectedFilm}
            onBack={handleBackToHome}
            onPlay={handlePlayMovie}
          />
        )
      )}

      {currentScreen === 'playback' && selectedFilm && (
        <PlaybackScreen
          movie={selectedFilm}
          onExit={handleExitPlayback}
        />
      )}

      {showPaymentDialog && (
        <PaymentDialog
          onConfirm={handlePaymentConfirm}
          onCancel={handlePaymentCancel}
        />
      )}

      {showFeedbackToast && selectedFilm && (
        <FeedbackToast
          movieDetails={selectedFilm}
          feedbackGiven={feedbackGiven}
          onFeedback={handleFeedback}
          onClose={handleCloseFeedback}
        />
      )}
    </div>
  );
}
