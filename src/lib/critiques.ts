import { ALL_FILMS } from '../data/films';
import type { FilmData } from '../data/films';

export interface CritiqueArticle {
  filmId: number;
  headline: string;
  publishDate: string; // film.availability.start
  excerpt: string;     // first 2-3 sentences of critique
  film: FilmData;
}

// Handcrafted editorial headlines — one per film
const HEADLINES: Record<number, string> = {
  1:  'Corruption, Quietly: The Uncompromising Noir of Shadows of Tomorrow',
  2:  'A Hymn to Cinema: On The Last Projection',
  3:  'Speaking Volumes: Portraits in Silence and the Eloquence of Restraint',
  4:  'When Technology Has a Soul: Dark Horizons Reimagines Dystopia',
  5:  'Love in Absentia: How City Lights Reinvents Romance',
  6:  'The Cost of Commitment: Through the Lens and the Analog Life',
  7:  'Identity Under Siege: Echoes and the Architecture of Self',
  8:  'Grief Has Roots: Into the Woods as Folk Horror Therapy',
  9:  'Seeing Again: How Luminescence Transforms Perception',
  10: 'The City as Witness: On Silhouettes',
  11: 'Love in a City of Forgetting: On Neon Dreams',
  12: 'The Desert Clarifies: On Wasteland',
  13: 'The Weight of Objects: The Empty Room and the Physics of Loss',
  14: 'What the Ocean Holds: On Tides',
  15: 'Whose Beauty Counts: Concrete and the Politics of Architecture',
  16: 'Between Waking and Sleep: On Haze',
  17: 'Permission to Not Know: On The Road Less Traveled',
  18: 'Why We Climb: On Summit',
  19: 'What We Cannot See: Between Shadows Reinvents Noir',
  20: 'The Moral Ecology of 3 AM: On Midnight City',
  21: 'Success and Its Discontents: On Reflections',
  22: 'Beauty Without Context: On Ruins',
  23: 'Ordinary Courage in Impossible Times: On Winter\'s End',
  24: 'What Women See: Through the Window and the Right to Testimony',
  25: 'The House We Inherit: Red Room and the Horror of Matrilineal Damage',
  26: 'The Stories We Need to Keep Going: On Solitude',
  27: 'Forty Years of Steps: On Ascension',
  28: 'What Communities Choose Not to See: On Lost in the Fog',
  29: 'The Long Take as Act of Faith: On Night Walk',
  30: 'Every Film Lost Is a Death: On The Archives',
  31: 'The Self as Collaborative Fiction: On Fragments',
};

// Extract the first 2–3 sentences from a critique as a readable excerpt.
// Sentences end with '. ' or '.' at end-of-string.
function extractExcerpt(critique: string, maxSentences = 3): string {
  const sentencePattern = /[^.!?]+[.!?]+(\s|$)/g;
  const sentences: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = sentencePattern.exec(critique)) !== null && sentences.length < maxSentences) {
    sentences.push(match[0].trim());
  }
  return sentences.join(' ').trim();
}

export function getCritiqueArticle(film: FilmData): CritiqueArticle {
  return {
    filmId: film.id,
    headline: HEADLINES[film.id] ?? `On ${film.title}`,
    publishDate: film.availability.start,
    excerpt: extractExcerpt(film.critique),
    film,
  };
}

// Returns all critique articles sorted by publish date, newest first.
export function getAllCritiqueArticles(): CritiqueArticle[] {
  return ALL_FILMS
    .map(getCritiqueArticle)
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

// Format an ISO date string as "Jan 15, 2024"
export function formatPublishDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
