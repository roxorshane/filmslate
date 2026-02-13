import { ALL_FILMS } from '../data/films';
import type { FilmData } from '../data/films';

function isFilmAvailable(film: FilmData, now: Date = new Date()): boolean {
  const start = new Date(film.availability.start);
  const end = new Date(film.availability.end);
  return now >= start && now <= end;
}

function getFilmById(id: number): FilmData | undefined {
  return ALL_FILMS.find(f => f.id === id);
}

function getAvailableFilms(now: Date = new Date()): FilmData[] {
  return ALL_FILMS.filter(f => isFilmAvailable(f, now));
}

export { isFilmAvailable, getFilmById, getAvailableFilms };
export default { isFilmAvailable, getFilmById, getAvailableFilms };
