import { ArrowLeft, Play, Clock, Calendar, Award } from 'lucide-react';
import type { FilmData } from '../data/films';
import type { Recommendation } from '../lib/rag';
import { UnavailableMovieDialog } from './UnavailableMovieDialog';

interface MovieDetailPageProps {
  film: FilmData;
  onBack: () => void;
  onPlay: () => void;
  isUnavailable?: boolean;
  recommendations?: Recommendation[];
  onSelectFilm?: (film: FilmData) => void;
  onViewAll?: () => void;
}

export function MovieDetailPage({
  film,
  onBack,
  onPlay,
  isUnavailable = false,
  recommendations = [],
  onSelectFilm,
  onViewAll,
}: MovieDetailPageProps) {
  return (
    <div className="min-h-screen">
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-black hover:bg-white transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Hero section */}
      <div className="relative h-screen">
        <img
          src={film.image}
          alt={film.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-12 pb-12">
          <div className="max-w-4xl">
            <h1 className="text-6xl text-white bg-black inline-block mb-4 px-6 py-4">
              {film.title}
            </h1>

            {/* Metadata row */}
            <div className="flex items-center gap-5 mb-6 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {film.releaseYear}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {film.runtime} min
              </span>
              <span>{film.genres.join(' · ')}</span>
            </div>

            <button
              onClick={onPlay}
              className="flex items-center gap-3 px-10 py-4 bg-black text-white hover:bg-black/90 transition-all duration-200 text-lg mb-8"
            >
              <Play className="w-6 h-6" fill="white" />
              Play
            </button>

            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-xl text-black mb-3">About</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {film.synopsis}
                </p>
              </div>

              {film.awards.length > 0 && (
                <div>
                  <h3 className="text-sm text-slate-500 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> Recognition
                  </h3>
                  <ul className="space-y-1">
                    {film.awards.map(award => (
                      <li key={award} className="text-sm text-slate-600">{award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unavailable overlay */}
      {isUnavailable && recommendations.length > 0 && onSelectFilm && onViewAll && (
        <UnavailableMovieDialog
          unavailableFilm={film}
          recommendations={recommendations}
          onSelectFilm={onSelectFilm}
          onViewAll={onViewAll}
          onClose={onBack}
        />
      )}
    </div>
  );
}
