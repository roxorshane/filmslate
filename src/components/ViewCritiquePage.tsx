import { ArrowLeft, Clock, Calendar, Award, Film, ExternalLink } from 'lucide-react';
import { getCritiqueArticle } from '../lib/critiques';
import type { FilmData } from '../data/films';

interface ViewCritiquePageProps {
  film: FilmData;
  onBack: () => void;
  onWatchFilm: (film: FilmData) => void;
}

// "JAN 31, 2026"
function longDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
}

export function ViewCritiquePage({ film, onBack, onWatchFilm }: ViewCritiquePageProps) {
  const article = getCritiqueArticle(film);
  const paragraphs = splitIntoParagraphs(film.critique);

  return (
    <div className="min-h-screen bg-white">
      {/* Slim top bar */}
      <nav aria-label="Critique navigation" className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" /> All critiques
          </button>
          <p className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>FilmSlate</p>
          <div className="w-28" />
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-2xl mx-auto px-6 pt-10 pb-20">

        {/* Category label */}
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-4">
          {film.genres[0]}
        </p>

        {/* Headline */}
        <h1
          className="text-4xl font-bold leading-tight text-gray-900 mb-3"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {article.headline}
        </h1>

        {/* Subtitle — film short description */}
        <p className="text-xl text-gray-600 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          {film.description}
        </p>

        {/* Author row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <Film size={14} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">FilmSlate</p>
            <p className="text-xs text-gray-600">{longDate(article.publishDate)}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8" />

        {/* Body */}
        <div className="mb-12">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed text-gray-800 mb-5"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Film metadata */}
        <section aria-label="Film details" className="border border-gray-200 p-6 mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Film details</p>
          <div className="space-y-3">
            <MetaRow icon={<Film size={14} aria-hidden="true" />} label="Director" value={film.director} />
            <MetaRow icon={<Calendar size={14} aria-hidden="true" />} label="Year" value={String(film.releaseYear)} />
            <MetaRow icon={<Clock size={14} aria-hidden="true" />} label="Runtime" value={`${film.runtime} min`} />
            {film.awards.length > 0 && (
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <span className="flex-shrink-0 mt-0.5 text-gray-600"><Award size={14} aria-hidden="true" /></span>
                <div className="space-y-1">
                  {film.awards.map((award, i) => (
                    <p key={i} className="text-sm text-gray-700">{award}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <aside aria-label="Watch this film" className="border border-gray-900 p-8 text-center">
          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            Now streaming on FilmSlate
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            {film.title}
          </p>
          <button
            onClick={() => onWatchFilm(film)}
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Watch on FilmSlate <ExternalLink size={14} aria-hidden="true" />
          </button>
          <p className="text-xs text-gray-600 mt-4">Part of FilmSlate's rotating 30-day library</p>
        </aside>

      </article>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-600 flex-shrink-0">{icon}</span>
      <span className="text-sm text-gray-600 w-16 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function splitIntoParagraphs(text: string): string[] {
  if (text.includes('\n\n')) {
    return text.split('\n\n').map(p => p.trim()).filter(Boolean);
  }
  const sentencePattern = /[^.!?]+[.!?]+(\s|$)/g;
  const sentences: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = sentencePattern.exec(text)) !== null) {
    sentences.push(match[0].trim());
  }
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    paragraphs.push(sentences.slice(i, i + 3).join(' '));
  }
  return paragraphs.length > 0 ? paragraphs : [text];
}
