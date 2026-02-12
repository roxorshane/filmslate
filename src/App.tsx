import { useState } from 'react';
import { LandingScreen } from './components/LandingScreen';
import { SignupBasicInfo } from './components/SignupBasicInfo';
import { SignupGenrePreferences } from './components/SignupGenrePreferences';
import { HomeScreen } from './components/HomeScreen';
import { MovieDetailPage } from './components/MovieDetailPage';
import { PlaybackScreen } from './components/PlaybackScreen';
import { PaymentDialog } from './components/PaymentDialog';
import { FeedbackToast } from './components/FeedbackToast';

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

export interface Movie {
  id: number;
  title: string;
  image: string;
  description: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    dateOfBirth: '',
    email: '',
    password: '',
    genres: [],
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  const handleCreateAccount = () => {
    setCurrentScreen('signup-basic');
  };

  const handleBasicInfoSubmit = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
    setCurrentScreen('signup-genres');
  };

  const handleChooseGenresClick = () => {
    setCurrentScreen('signup-genres');
  };

  const handleGenreSubmit = (genres: string[]) => {
    setUserData((prev) => ({ ...prev, genres }));
    setCurrentScreen('home');
  };

  const handleSkipGenres = () => {
    setCurrentScreen('home');
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentScreen('movie-detail');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedMovie(null);
  };

  const handlePlayMovie = () => {
    setShowPaymentDialog(true);
  };

  const handlePaymentConfirm = () => {
    setShowPaymentDialog(false);
    setCurrentScreen('playback');
  };

  const handlePaymentCancel = () => {
    setShowPaymentDialog(false);
  };

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
        <SignupBasicInfo onSubmit={handleBasicInfoSubmit} />
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
          onMovieSelect={handleMovieSelect}
          onChooseGenresClick={handleChooseGenresClick}
        />
      )}

      {currentScreen === 'movie-detail' && selectedMovie && (
        <MovieDetailPage 
          movie={selectedMovie}
          onBack={handleBackToHome}
          onPlay={handlePlayMovie}
        />
      )}

      {currentScreen === 'playback' && selectedMovie && (
        <PlaybackScreen 
          movie={selectedMovie}
          onExit={handleExitPlayback}
        />
      )}

      {showPaymentDialog && (
        <PaymentDialog 
          onConfirm={handlePaymentConfirm}
          onCancel={handlePaymentCancel}
        />
      )}

      {showFeedbackToast && (
        <FeedbackToast 
          movieDetails={selectedMovie}
          feedbackGiven={feedbackGiven}
          onFeedback={handleFeedback}
          onClose={handleCloseFeedback}
        />
      )}
    </div>
  );
}
