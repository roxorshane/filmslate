import { shortDate } from '@/helpers';
import { getAllCritiqueArticles } from '@/data';
import type { CritiqueArticle } from '@/data';
import type { FilmData } from '@/types';
import { cn } from '@/helpers';
import styles from './CritiqueListPage.module.css';

interface CritiqueListPageProps {
  onSelectCritique: (film: FilmData) => void;
  onBack: () => void;
}

export function CritiqueListPage({ onSelectCritique, onBack }: CritiqueListPageProps) {
  const articles = getAllCritiqueArticles();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button onClick={onBack} className={styles.backButton}>&larr; FilmSlate</button>
          <div className={styles.headerCenter}>
            <h1 className={styles.headerTitle}>FilmSlate</h1>
            <p className={styles.headerSubtitle}>Film criticism</p>
          </div>
          <div className={styles.headerSpacer} />
        </div>
      </header>
      <main className={styles.articleList}>
        {articles.map(article => (
          <Row key={article.filmId} article={article} onSelect={() => onSelectCritique(article.film)} />
        ))}
      </main>
    </div>
  );
}

function Row({ article, onSelect }: { article: CritiqueArticle; onSelect: () => void }) {
  return (
    <article
      className={cn(styles.row, "group")}
      onClick={onSelect}
      tabIndex={0}
      role="link"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
    >
      <div className={styles.rowContent}>
        <h2 className={styles.rowHeadline}>{article.headline}</h2>
        <p className={styles.rowDescription}>{article.film.description}</p>
        <p className={styles.rowMeta}>
          {shortDate(article.publishDate)}
          <span className={styles.rowMetaSeparator}>&middot;</span>
          {article.film.genres[0]}
        </p>
      </div>
      <div className={styles.rowThumbnailWrapper}>
        <img src={article.film.image} alt={article.film.title} className={styles.rowThumbnailImage} />
      </div>
    </article>
  );
}

export default CritiqueListPage;
