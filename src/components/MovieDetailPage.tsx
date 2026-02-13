import { ArrowLeft, Play, Clock, Calendar, Award } from 'lucide-react';
import type { FilmData } from '../data/films';

interface MovieDetailPageProps {
  film: FilmData;
  onBack: () => void;
  onPlay: () => void;
}

export function MovieDetailPage({
  film,
  onBack,
  onPlay,
}: MovieDetailPageProps) {
  return (
    <main className="min-h-screen">
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-black hover:bg-white transition-all cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
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

            <button
              onClick={onPlay}
              className="flex items-center gap-3 px-10 py-4 bg-black text-white hover:bg-black/90 transition-all duration-200 text-lg mb-8 cursor-pointer"
            >
              <Play className="w-6 h-6" fill="white" aria-hidden="true" />
              Play
            </button>

            <div className="max-w-2xl space-y-6">
                          {/* Metadata row */}
            <div className="inline-flex w-fit items-center gap-5 mb-6 text-sm text-slate-800 bg-white/60 backdrop-blur-sm px-4 py-2 rounded">
              <span className="flex items-center gap-1.5" aria-label={`Released in ${film.releaseYear}`}>
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <span aria-hidden="true">{film.releaseYear}</span>
              </span>
              <span className="flex items-center gap-1.5" aria-label={`Runtime ${film.runtime} minutes`}>
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span aria-hidden="true">{film.runtime} min</span>
              </span>
              <span aria-label={`Genres: ${film.genres.join(', ')}`}>
                <span aria-hidden="true">{film.genres.join(' · ')}</span>
              </span>
            </div>

              <div>
                <h3 className="text-xl text-black mb-3">About</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {film.synopsis}
                </p>
              </div>

              {film.awards.length > 0 && (
                <div>
                  <h3 className="text-sm text-slate-600 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" aria-hidden="true" /> Recognition
                  </h3>
                  <ul className="space-y-1">
                    {film.awards.map(award => (
                      <li key={award} className="text-sm text-slate-700">{award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
