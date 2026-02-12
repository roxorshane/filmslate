import type { FilmData } from '../data/films';

export interface Recommendation {
  film: FilmData;
  reason: string;
  score: number;
}

// Common English stop words to exclude from TF-IDF
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall',
  'this','that','these','those','it','its','not','no','nor','so','yet',
  'both','either','neither','whether','as','if','than','then','when','where',
  'which','who','what','how','all','each','every','both','few','more','most',
  'other','some','such','only','own','same','too','very','just','also','i',
  'we','you','he','she','they','their','our','your','his','her','my',
  'can','cannot','about','into','through','during','before','after','above',
  'between','out','off','over','under','again','further','once','here','there',
  'while','although','because','since','rather','even','still','already',
  'without','within','along','across','behind','beyond','up','down','new',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .map(t => t.replace(/^[-']+|[-']+$/g, ''))
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
}

function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) ?? 0) + 1);
  }
  // Normalize by document length
  for (const [term, count] of tf) {
    tf.set(term, count / tokens.length);
  }
  return tf;
}

function buildIDF(documents: string[][]): Map<string, number> {
  const N = documents.length;
  const df = new Map<string, number>();
  for (const doc of documents) {
    const unique = new Set(doc);
    for (const term of unique) {
      df.set(term, (df.get(term) ?? 0) + 1);
    }
  }
  const idf = new Map<string, number>();
  for (const [term, count] of df) {
    idf.set(term, Math.log((N + 1) / (count + 1)) + 1); // smoothed IDF
  }
  return idf;
}

function tfidfVector(tf: Map<string, number>, idf: Map<string, number>, vocab: string[]): number[] {
  return vocab.map(term => (tf.get(term) ?? 0) * (idf.get(term) ?? 0));
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function buildDocument(film: FilmData): string {
  return [
    film.critique,
    film.synopsis,
    film.genres.join(' '),
    film.description,
  ].join(' ');
}

/** Extract the most semantically distinctive shared terms between two token sets */
function sharedThemes(
  queryTokens: string[],
  candidateTokens: string[],
  idf: Map<string, number>,
  topN = 3,
): string[] {
  const querySet = new Set(queryTokens);
  const candidateSet = new Set(candidateTokens);
  const shared = [...querySet].filter(t => candidateSet.has(t));
  // Weight shared terms by IDF (rarer terms = more distinctive)
  return shared
    .sort((a, b) => (idf.get(b) ?? 0) - (idf.get(a) ?? 0))
    .slice(0, topN);
}

// Map raw thematic tokens to readable theme phrases
const THEME_PHRASES: Record<string, string> = {
  identity: 'identity', memory: 'memory', grief: 'grief', loss: 'loss',
  silence: 'silence', isolation: 'isolation', darkness: 'darkness',
  corruption: 'moral ambiguity', city: 'urban life', urban: 'urban life',
  noir: 'noir atmosphere', detective: 'detective noir', crime: 'crime',
  consciousness: 'consciousness', perception: 'perception',
  survival: 'survival', nature: 'nature', landscape: 'landscape',
  documentary: 'documentary craft', art: 'artistic process',
  cinema: 'cinema itself', film: 'the art of filmmaking',
  preservation: 'preservation', archive: 'archival memory',
  trauma: 'trauma', horror: 'dread', fear: 'fear',
  romance: 'romance', love: 'love', longing: 'longing',
  mystery: 'mystery', investigation: 'investigation',
  experimental: 'formal experimentation', formal: 'formal invention',
  body: 'bodily experience', physical: 'physicality',
  time: 'time', repetition: 'repetition', devotion: 'devotion',
  power: 'power', institution: 'institutions', political: 'politics',
  complicity: 'complicity', moral: 'moral weight',
  community: 'community', belonging: 'belonging',
};

function generateReason(
  queryFilm: FilmData,
  candidate: FilmData,
  sharedTerms: string[],
): string {
  // Map terms to readable phrases, deduplicate
  const phrases = [
    ...new Set(
      sharedTerms
        .map(t => THEME_PHRASES[t])
        .filter(Boolean)
    )
  ];

  if (phrases.length >= 2) {
    return `Like ${queryFilm.title}, this film explores themes of ${phrases[0]} and ${phrases[1]} with a similarly assured sense of craft.`;
  }
  if (phrases.length === 1) {
    return `Shares ${queryFilm.title}'s preoccupation with ${phrases[0]}, brought to life through bold and distinctive filmmaking.`;
  }

  // Fallback: genre-based reason
  const sharedGenres = queryFilm.genres.filter(g =>
    candidate.genres.some(cg => cg.toLowerCase() === g.toLowerCase())
  );
  if (sharedGenres.length > 0) {
    return `A compelling ${sharedGenres[0].toLowerCase()} film with the same emotional intensity and artistic rigour as ${queryFilm.title}.`;
  }

  return `Selected for its thematic resonance with ${queryFilm.title} — a film that shares its commitment to authentic, uncompromising storytelling.`;
}

/**
 * Find the top N available films most similar to the query film,
 * using TF-IDF cosine similarity over critique + synopsis + genre text.
 */
export function getRecommendations(
  queryFilm: FilmData,
  availableFilms: FilmData[],
  topN = 3,
): Recommendation[] {
  const candidates = availableFilms.filter(f => f.id !== queryFilm.id);
  if (candidates.length === 0) return [];

  const allFilms = [queryFilm, ...candidates];
  const tokenizedDocs = allFilms.map(f => tokenize(buildDocument(f)));
  const idf = buildIDF(tokenizedDocs);

  // Build shared vocabulary
  const vocab = [...idf.keys()];

  const queryTf = termFrequency(tokenizedDocs[0]);
  const queryVec = tfidfVector(queryTf, idf, vocab);
  const queryTokenSet = tokenizedDocs[0];

  const scored = candidates.map((film, i) => {
    const tf = termFrequency(tokenizedDocs[i + 1]);
    const vec = tfidfVector(tf, idf, vocab);
    const score = cosineSimilarity(queryVec, vec);
    const shared = sharedThemes(queryTokenSet, tokenizedDocs[i + 1], idf);
    const reason = generateReason(queryFilm, film, shared);
    return { film, reason, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
