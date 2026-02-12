import { useEffect, useRef } from 'react';
import { X, Film, ArrowRight } from 'lucide-react';
import type { FilmData } from '../data/films';
import type { Recommendation } from '../lib/rag';

interface UnavailableMovieDialogProps {
  unavailableFilm: FilmData;
  recommendations: Recommendation[];
  onSelectFilm: (film: FilmData) => void;
  onViewAll: () => void;
  onClose: () => void;
}

export function UnavailableMovieDialog({
  unavailableFilm,
  recommendations,
  onSelectFilm,
  onViewAll,
  onClose,
}: UnavailableMovieDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the dialog on mount, trap focus within it
  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unavailable-dialog-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      >
        <div className="relative w-full max-w-2xl bg-white overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3 mr-8">
              <Film className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <h2
                  id="unavailable-dialog-title"
                  className="text-xl text-black leading-snug"
                >
                  This film is no longer available
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  <span className="font-medium text-black">{unavailableFilm.title}</span> has left our rotating 30-day library.
                  Here are three films you might love instead.
                </p>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 p-1.5 text-slate-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Suggestions */}
          <div className="overflow-y-auto flex-1 px-8 py-6 space-y-4">
            {recommendations.map(({ film, reason }) => (
              <button
                key={film.id}
                onClick={() => onSelectFilm(film)}
                className="group w-full flex gap-4 text-left hover:bg-slate-50 transition-colors p-2 -mx-2"
              >
                {/* Thumbnail */}
                <div
                  className="shrink-0 overflow-hidden bg-slate-100"
                  style={{ width: 80, height: 120 }}
                >
                  <img
                    src={film.image}
                    alt={film.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base text-black group-hover:text-slate-700 transition-colors leading-snug">
                      {film.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 shrink-0 text-slate-300 group-hover:text-black transition-colors mt-0.5" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {film.director} · {film.releaseYear} · {film.runtime} min
                  </p>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {film.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed italic">
                    {reason}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-slate-100">
            <button
              onClick={onViewAll}
              className="w-full py-3 bg-black text-white text-sm hover:bg-black/90 transition-all"
            >
              View all films
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
