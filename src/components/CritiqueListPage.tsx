import { getAllCritiqueArticles } from '../lib/critiques';
import type { CritiqueArticle } from '../lib/critiques';
import type { FilmData } from '../data/films';

interface CritiqueListPageProps {
  onSelectCritique: (film: FilmData) => void;
  onBack: () => void;
}

// "JAN 31" — no year, uppercase
function shortDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

export function CritiqueListPage({ onSelectCritique, onBack }: CritiqueListPageProps) {
  const articles = getAllCritiqueArticles();

  return (
    <div className="min-h-screen bg-white">
      {/* Publication header */}
      <header className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← FilmSlate
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              FilmSlate
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">Film criticism</p>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6">
        {articles.map(article => (
          <Row
            key={article.filmId}
            article={article}
            onSelect={() => onSelectCritique(article.film)}
          />
        ))}
      </main>
    </div>
  );
}

function Row({ article, onSelect }: { article: CritiqueArticle; onSelect: () => void }) {
  return (
    <article
      className="flex items-start gap-6 py-6 border-b border-gray-200 cursor-pointer group"
      onClick={onSelect}
      tabIndex={0}
      role="link"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
    >
      {/* Text */}
      <div className="flex-1 min-w-0">
        <h2
          className="text-xl font-bold leading-snug text-gray-900 group-hover:text-gray-500 transition-colors mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {article.headline}
        </h2>
        <p className="text-base text-gray-600 leading-snug mb-2">
          {article.film.description}
        </p>
        <p
          className="uppercase"
          style={{ color: '#6b6b6b', fontSize: 11, fontWeight: 500, letterSpacing: '0.2px' }}
        >
          {shortDate(article.publishDate)}
          <span style={{ margin: '0 6px' }}>&middot;</span>
          {article.film.genres[0]}
        </p>
      </div>

      {/* Thumbnail */}
      <div className="flex-shrink-0 overflow-hidden rounded-xs bg-gray-100" style={{ width: 140, height: 90 }}>
        <img
          src={article.film.image}
          alt={article.film.title}
          style={{ width: 140, height: 90, objectFit: 'cover', display: 'block' }}
        />
      </div>
    </article>
  );
}
