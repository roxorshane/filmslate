import { useState } from 'react';
import { CritiqueListPage } from './components/CritiqueListPage';
import { ViewCritiquePage } from './components/ViewCritiquePage';
import { getFilmById } from './data/films';
import type { FilmData } from './data/films';

type SubstackScreen = 'list' | 'detail';

function getInitialScreen(): { screen: SubstackScreen; film: FilmData | null } {
  const params = new URLSearchParams(window.location.search);
  const idStr = params.get('id');
  if (idStr) {
    const film = getFilmById(parseInt(idStr, 10));
    if (film) return { screen: 'detail', film };
  }
  return { screen: 'list', film: null };
}

export default function SubstackApp() {
  const initial = getInitialScreen();
  const [screen, setScreen] = useState<SubstackScreen>(initial.screen);
  const [selectedFilm, setSelectedFilm] = useState<FilmData | null>(initial.film);

  const handleSelectCritique = (film: FilmData) => {
    history.pushState(null, '', `/substack?id=${film.id}`);
    setSelectedFilm(film);
    setScreen('detail');
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    history.pushState(null, '', '/substack');
    setScreen('list');
    setSelectedFilm(null);
    window.scrollTo(0, 0);
  };

  // "Watch on FilmSlate" — full navigation to the main app with ?mid= deep link
  const handleWatchFilm = (film: FilmData) => {
    window.location.href = `/?mid=${film.id}`;
  };

  // "← FilmSlate" from the critique list header
  const handleBackToFilmSlate = () => {
    window.location.href = '/';
  };

  if (screen === 'detail' && selectedFilm) {
    return (
      <ViewCritiquePage
        film={selectedFilm}
        onBack={handleBackToList}
        onWatchFilm={handleWatchFilm}
      />
    );
  }

  return (
    <CritiqueListPage
      onSelectCritique={handleSelectCritique}
      onBack={handleBackToFilmSlate}
    />
  );
}
