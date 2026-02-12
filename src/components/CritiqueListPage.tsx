import { ArrowRight } from 'lucide-react';
import { getAllCritiqueArticles, formatPublishDate } from '../lib/critiques';
import type { CritiqueArticle } from '../lib/critiques';
import type { FilmData } from '../data/films';

interface CritiqueListPageProps {
  onSelectCritique: (film: FilmData) => void;
  onBack: () => void;
}

export function CritiqueListPage({ onSelectCritique, onBack }: CritiqueListPageProps) {
  const articles = getAllCritiqueArticles();
  const [featured, ...rest] = articles;

  return (
    <div className="min-h-screen bg-white">
      {/* Publication header */}
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← FilmSlate
          </button>
          <div className="text-center">
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">FilmSlate Editorial</p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              Film Critiques
            </h1>
          </div>
          <div className="w-20" /> {/* spacer to balance header */}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* Featured article */}
        {featured && (
          <FeaturedCard article={featured} onSelect={() => onSelectCritique(featured.film)} />
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-12" />

        {/* Article feed */}
        <div className="space-y-10">
          {rest.map(article => (
            <ArticleCard
              key={article.filmId}
              article={article}
              onSelect={() => onSelectCritique(article.film)}
            />
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-400">
            FilmSlate Editorial — Film criticism for a rotating library
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeaturedCard({ article, onSelect }: { article: CritiqueArticle; onSelect: () => void }) {
  return (
    <article className="cursor-pointer group" onClick={onSelect}>
      {/* Hero image */}
      <div className="aspect-[2/1] overflow-hidden bg-gray-100 mb-6">
        <img
          src={article.film.image}
          alt={article.film.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Genre tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {article.film.genres.slice(0, 3).map(g => (
          <span key={g} className="text-xs uppercase tracking-wider text-gray-500 border border-gray-300 px-2 py-0.5">
            {g}
          </span>
        ))}
      </div>

      {/* Headline */}
      <h2
        className="text-3xl font-bold leading-tight text-gray-900 mb-3 group-hover:text-gray-600 transition-colors"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {article.headline}
      </h2>

      {/* Byline */}
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium text-gray-700">FilmSlate</span>
        {' · '}
        {formatPublishDate(article.publishDate)}
      </p>

      {/* Excerpt */}
      <p className="text-lg text-gray-600 leading-relaxed mb-5" style={{ fontFamily: 'Georgia, serif' }}>
        {article.excerpt}
      </p>

      {/* Read more */}
      <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 group-hover:gap-2 transition-all">
        Read critique <ArrowRight size={14} />
      </span>
    </article>
  );
}

function ArticleCard({ article, onSelect }: { article: CritiqueArticle; onSelect: () => void }) {
  return (
    <article
      className="flex gap-6 cursor-pointer group border-b border-gray-100 pb-10"
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-36 h-24 overflow-hidden bg-gray-100">
        <img
          src={article.film.image}
          alt={article.film.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Genre tag */}
        <div className="mb-1.5">
          <span className="text-xs uppercase tracking-wider text-gray-400">
            {article.film.genres[0]}
          </span>
        </div>

        {/* Headline */}
        <h3
          className="text-lg font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors mb-2"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {article.headline}
        </h3>

        {/* Excerpt — 2 lines */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {article.excerpt}
        </p>

        {/* Byline */}
        <p className="text-xs text-gray-400">
          <span className="text-gray-600">FilmSlate</span>
          {' · '}
          {formatPublishDate(article.publishDate)}
        </p>
      </div>
    </article>
  );
}
