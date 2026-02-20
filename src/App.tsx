import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import {
  LandingScreen, SignupBasicInfo, SignupGenrePreferences,
  HomeScreen, MovieDetailPage, MovieUnavailableScreen,
  PlaybackScreen, CritiqueListPage, ViewCritiquePage,
} from '@/views';
import { PaymentDialog, FeedbackToast } from '@/components';
import { ALL_FILMS } from '@/data';
import type { FilmData } from '@/data';
import { getFilmById, isFilmAvailable, getAvailableFilms, getRecommendations } from '@/helpers';
import type { Recommendation } from '@/helpers';
import type { UserData } from '@/types';

function FilmRoute({
  userData,
  tosAccepted,
  trialActivated,
  pendingAction,
  showPaymentDialog,
  showFeedbackToast,
  feedbackGiven,
  setUserData,
  setTosAccepted,
  setTrialActivated,
  setPendingAction,
  setShowPaymentDialog,
  setShowFeedbackToast,
  setFeedbackGiven,
}: {
  userData: UserData;
  tosAccepted: boolean;
  trialActivated: boolean;
  pendingAction: 'play' | 'genres' | null;
  showPaymentDialog: boolean;
  showFeedbackToast: boolean;
  feedbackGiven: 'up' | 'down' | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  setTosAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  setTrialActivated: React.Dispatch<React.SetStateAction<boolean>>;
  setPendingAction: React.Dispatch<React.SetStateAction<'play' | 'genres' | null>>;
  setShowPaymentDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFeedbackToast: React.Dispatch<React.SetStateAction<boolean>>;
  setFeedbackGiven: React.Dispatch<React.SetStateAction<'up' | 'down' | null>>;
}) {
  const { filmId } = useParams<{ filmId: string }>();
  const navigate = useNavigate();

  const id = parseInt(filmId ?? '', 10);
  const film = isNaN(id) ? undefined : getFilmById(id);

  if (!film) {
    return <div>Film not found</div>;
  }

  const available = isFilmAvailable(film);

  const navigateToFilm = (f: FilmData) => {
    navigate(`/film/${f.id}`);
  };

  const handleNavigateToEditorial = (f: FilmData) => {
    window.open(`${import.meta.env.BASE_URL}substack/${f.id}`, '_blank');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handlePlayMovie = () => {
    if (!tosAccepted) {
      setPendingAction('play');
      navigate('/signup');
      return;
    }
    if (!trialActivated) {
      setShowPaymentDialog(true);
      return;
    }
    navigate(`/film/${film.id}/play`);
  };

  const handlePaymentConfirm = () => {
    setTrialActivated(true);
    setShowPaymentDialog(false);
    navigate(`/film/${film.id}/play`);
  };

  const handlePaymentCancel = () => setShowPaymentDialog(false);

  if (!available) {
    const recommendations = getRecommendations(film, getAvailableFilms());
    return (
      <>
        <MovieUnavailableScreen
          film={film}
          recommendations={recommendations}
          onSelectFilm={navigateToFilm}
          onReadEditorial={handleNavigateToEditorial}
          onViewAll={handleBackToHome}
        />
        {showPaymentDialog && (
          <PaymentDialog onConfirm={handlePaymentConfirm} onCancel={handlePaymentCancel} />
        )}
      </>
    );
  }

  return (
    <>
      <MovieDetailPage
        film={film}
        onBack={handleBackToHome}
        onPlay={handlePlayMovie}
      />
      {showPaymentDialog && (
        <PaymentDialog onConfirm={handlePaymentConfirm} onCancel={handlePaymentCancel} />
      )}
    </>
  );
}

function PlaybackRoute({
  setShowFeedbackToast,
  setFeedbackGiven,
}: {
  setShowFeedbackToast: React.Dispatch<React.SetStateAction<boolean>>;
  setFeedbackGiven: React.Dispatch<React.SetStateAction<'up' | 'down' | null>>;
}) {
  const { filmId } = useParams<{ filmId: string }>();
  const navigate = useNavigate();

  const id = parseInt(filmId ?? '', 10);
  const film = isNaN(id) ? undefined : getFilmById(id);

  if (!film) {
    return <div>Film not found</div>;
  }

  const handleExitPlayback = () => {
    navigate('/home');
    setShowFeedbackToast(true);
    setFeedbackGiven(null);
  };

  return <PlaybackScreen movie={film} onExit={handleExitPlayback} />;
}

function SubstackDetailRoute() {
  const { filmId } = useParams<{ filmId: string }>();
  const navigate = useNavigate();

  const id = parseInt(filmId ?? '', 10);
  const film = isNaN(id) ? undefined : getFilmById(id);

  if (!film) {
    return <div>Film not found</div>;
  }

  return (
    <ViewCritiquePage
      film={film}
      onBack={() => navigate('/substack')}
      onWatchFilm={(f) => navigate(`/film/${f.id}`)}
    />
  );
}

export default function App() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    dateOfBirth: '',
    email: '',
    password: '',
    genres: [],
  });

  const [tosAccepted, setTosAccepted] = useState(false);
  const [trialActivated, setTrialActivated] = useState(false);
  const [pendingAction, setPendingAction] = useState<'play' | 'genres' | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<FilmData | null>(null);

  const navigate = useNavigate();

  const handleCreateAccount = () => navigate('/signup');

  const handleBasicInfoSubmit = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
    setTosAccepted(true);
    if (pendingAction === 'play') {
      setPendingAction(null);
      navigate(-1); // Go back to the film they were trying to watch
      setShowPaymentDialog(true);
    } else {
      setPendingAction(null);
      navigate('/signup/genres');
    }
  };

  const handleChooseGenresClick = () => {
    if (!tosAccepted) {
      setPendingAction('genres');
      navigate('/signup');
      return;
    }
    navigate('/signup/genres');
  };

  const handleGenreSubmit = (genres: string[]) => {
    setUserData(prev => ({ ...prev, genres }));
    navigate('/home');
  };

  const handleSkipGenres = () => navigate('/home');

  const navigateToFilm = (film: FilmData) => {
    setSelectedFilm(film);
    navigate(`/film/${film.id}`);
  };

  const handleNavigateToCritiques = () => {
    navigate('/substack');
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
      <Routes>
        <Route path="/" element={<LandingScreen onCreateAccount={handleCreateAccount} onEditorialClick={handleNavigateToCritiques} />} />
        <Route
          path="/signup"
          element={
            <SignupBasicInfo
              onSubmit={handleBasicInfoSubmit}
              context={pendingAction ?? 'signup'}
            />
          }
        />
        <Route
          path="/signup/genres"
          element={
            <SignupGenrePreferences
              onSubmit={handleGenreSubmit}
              onSkip={handleSkipGenres}
            />
          }
        />
        <Route
          path="/home"
          element={
            <HomeScreen
              userData={userData}
              onMovieSelect={navigateToFilm}
              onChooseGenresClick={handleChooseGenresClick}
              onCritiquesClick={handleNavigateToCritiques}
            />
          }
        />
        <Route
          path="/film/:filmId"
          element={
            <FilmRoute
              userData={userData}
              tosAccepted={tosAccepted}
              trialActivated={trialActivated}
              pendingAction={pendingAction}
              showPaymentDialog={showPaymentDialog}
              showFeedbackToast={showFeedbackToast}
              feedbackGiven={feedbackGiven}
              setUserData={setUserData}
              setTosAccepted={setTosAccepted}
              setTrialActivated={setTrialActivated}
              setPendingAction={setPendingAction}
              setShowPaymentDialog={setShowPaymentDialog}
              setShowFeedbackToast={setShowFeedbackToast}
              setFeedbackGiven={setFeedbackGiven}
            />
          }
        />
        <Route
          path="/film/:filmId/play"
          element={
            <PlaybackRoute
              setShowFeedbackToast={setShowFeedbackToast}
              setFeedbackGiven={setFeedbackGiven}
            />
          }
        />
        <Route
          path="/substack"
          element={
            <CritiqueListPage
              onSelectCritique={(film) => navigate(`/substack/${film.id}`)}
              onBack={() => navigate('/')}
            />
          }
        />
        <Route path="/substack/:filmId" element={<SubstackDetailRoute />} />
      </Routes>

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
