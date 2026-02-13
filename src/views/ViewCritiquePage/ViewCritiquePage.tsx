import { ArrowLeft, Clock, Calendar, Award, Film, ExternalLink } from 'lucide-react';
import { getCritiqueArticle } from '@/data';
import { longDate, splitIntoParagraphs } from '@/helpers';
import type { FilmData } from '@/types';
import styles from './ViewCritiquePage.module.css';

interface ViewCritiquePageProps {
  film: FilmData;
  onBack: () => void;
  onWatchFilm: (film: FilmData) => void;
}

export function ViewCritiquePage({ film, onBack, onWatchFilm }: ViewCritiquePageProps) {
  const article = getCritiqueArticle(film);
  const paragraphs = splitIntoParagraphs(film.critique);
  return (
    <div className={styles.page}>
      <nav aria-label="Critique navigation" className={styles.nav}>
        <div className={styles.navInner}>
          <button onClick={onBack} className={styles.navBack}>
            <ArrowLeft size={14} aria-hidden="true" /> All critiques
          </button>
          <p className={styles.navTitle}>FilmSlate</p>
          <div className={styles.navSpacer} />
        </div>
      </nav>
      <article className={styles.article}>
        <p className={styles.genre}>{film.genres[0]}</p>
        <h1 className={styles.headline}>{article.headline}</h1>
        <p className={styles.description}>{film.description}</p>
        <div className={styles.authorRow}>
          <div className={styles.authorAvatar}>
            <Film size={14} className={styles.authorAvatarIcon} aria-hidden="true" />
          </div>
          <div>
            <p className={styles.authorName}>FilmSlate</p>
            <p className={styles.authorDate}>{longDate(article.publishDate)}</p>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.bodySection}>
          {paragraphs.map((para, i) => (
            <p key={i} className={styles.bodyParagraph}>{para}</p>
          ))}
        </div>
        <section aria-label="Film details" className={styles.detailsSection}>
          <p className={styles.detailsHeading}>Film details</p>
          <div className={styles.detailsList}>
            <MetaRow icon={<Film size={14} aria-hidden="true" />} label="Director" value={film.director} />
            <MetaRow icon={<Calendar size={14} aria-hidden="true" />} label="Year" value={String(film.releaseYear)} />
            <MetaRow icon={<Clock size={14} aria-hidden="true" />} label="Runtime" value={`${film.runtime} min`} />
            {film.awards.length > 0 && (
              <div className={styles.awardsRow}>
                <span className={styles.awardsIcon}><Award size={14} aria-hidden="true" /></span>
                <div className={styles.awardsList}>
                  {film.awards.map((award, i) => (
                    <p key={i} className={styles.awardItem}>{award}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        <aside aria-label="Watch this film" className={styles.watchAside}>
          <p className={styles.watchSubtitle}>Now streaming on FilmSlate</p>
          <p className={styles.watchTitle}>{film.title}</p>
          <button onClick={() => onWatchFilm(film)} className={styles.watchButton}>
            Watch on FilmSlate <ExternalLink size={14} aria-hidden="true" />
          </button>
          <p className={styles.watchFootnote}>Part of FilmSlate's rotating 30-day library</p>
        </aside>
      </article>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaIcon}>{icon}</span>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value}</span>
    </div>
  );
}

export default ViewCritiquePage;
