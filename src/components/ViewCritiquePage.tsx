import { ArrowLeft, Clock, Calendar, Award, Film, ExternalLink } from 'lucide-react';
import { getCritiqueArticle, formatPublishDate } from '../lib/critiques';
import type { FilmData } from '../data/films';

interface ViewCritiquePageProps {
  film: FilmData;
  onBack: () => void;           // back to critique list
  onWatchFilm: (film: FilmData) => void; // navigate to MovieDetailPage
}

export function ViewCritiquePage({ film, onBack, onWatchFilm }: ViewCritiquePageProps) {
  const article = getCritiqueArticle(film);

  // Split critique into paragraphs — split on double newline or after ~300 chars at a sentence boundary.
  const paragraphs = splitIntoParagraphs(film.critique);

  return (
    <div className="min-h-screen bg-white">
      {/* Slim top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={14} /> All critiques
          </button>
          <p className="text-xs tracking-widest uppercase text-gray-400">FilmSlate Editorial</p>
          <div className="w-28" />
        </div>
      </div>

      {/* Hero image — full bleed */}
      <div className="w-full aspect-[16/7] overflow-hidden bg-gray-100">
        <img
          src={film.image}
          alt={film.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article container */}
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Genre tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {film.genres.map(g => (
            <span
              key={g}
              className="text-xs uppercase tracking-wider text-gray-500 border border-gray-300 px-2 py-0.5"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h1
          className="text-4xl font-bold leading-tight text-gray-900 mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {article.headline}
        </h1>

        {/* Byline row */}
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-gray-200">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <Film size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">FilmSlate</p>
            <p className="text-xs text-gray-400">{formatPublishDate(article.publishDate)}</p>
          </div>
        </div>

        {/* Critique body */}
        <div className="mb-12">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-xl leading-relaxed text-gray-800 mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Film metadata card */}
        <div className="bg-gray-50 border border-gray-200 p-6 mb-12">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Film Details</h2>
          <div className="space-y-3">
            <MetaRow icon={<Film size={14} />} label="Director" value={film.director} />
            <MetaRow
              icon={<Calendar size={14} />}
              label="Year"
              value={String(film.releaseYear)}
            />
            <MetaRow
              icon={<Clock size={14} />}
              label="Runtime"
              value={`${film.runtime} min`}
            />
            {film.awards.length > 0 && (
              <div className="flex gap-3 pt-3 border-t border-gray-200">
                <span className="flex-shrink-0 mt-0.5 text-gray-400">
                  <Award size={14} />
                </span>
                <div className="space-y-1">
                  {film.awards.map((award, i) => (
                    <p key={i} className="text-sm text-gray-600">{award}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to action */}
        <div className="border border-gray-900 p-8 text-center">
          <p
            className="text-base text-gray-500 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Now streaming on FilmSlate
          </p>
          <p
            className="text-2xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {film.title}
          </p>
          <button
            onClick={() => onWatchFilm(film)}
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Watch on FilmSlate <ExternalLink size={14} />
          </button>
          <p className="text-xs text-gray-400 mt-4">
            Part of FilmSlate's rotating 30-day library
          </p>
        </div>

      </div>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-2xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-400">FilmSlate Editorial — Film criticism for a rotating library</p>
        </div>
      </footer>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="text-sm text-gray-500 w-16 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

// Break long critique text into readable paragraphs (~3–5 sentences each).
function splitIntoParagraphs(text: string): string[] {
  // If the text already has paragraph breaks, use them.
  if (text.includes('\n\n')) {
    return text.split('\n\n').map(p => p.trim()).filter(Boolean);
  }

  // Otherwise split into sentences and group them.
  const sentencePattern = /[^.!?]+[.!?]+(\s|$)/g;
  const sentences: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = sentencePattern.exec(text)) !== null) {
    sentences.push(match[0].trim());
  }

  // Group into paragraphs of ~3 sentences
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    paragraphs.push(sentences.slice(i, i + 3).join(' '));
  }
  return paragraphs.length > 0 ? paragraphs : [text];
}
