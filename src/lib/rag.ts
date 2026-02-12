import type { FilmData } from '../data/films';

/** A recommended film paired with a human-readable rationale and similarity score. */
export interface Recommendation {
  film: FilmData;
  reason: string;
  score: number;
}

// Common English stop words excluded from TF-IDF to reduce noise.
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

/**
 * Splits raw text into a list of meaningful lowercase tokens.
 *
 * Strips punctuation, removes leading/trailing hyphens and apostrophes,
 * drops tokens shorter than 3 characters, and filters out stop words.
 */
function tokenize(rawText: string): string[] {
  return rawText
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .map(token => token.replace(/^[-']+|[-']+$/g, ''))
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

/**
 * Computes normalised term-frequency for a list of tokens.
 *
 * Each term's count is divided by the total number of tokens so that
 * longer documents do not dominate shorter ones.
 *
 * @returns A map from term → normalised frequency (0–1).
 */
function computeTermFrequency(tokens: string[]): Map<string, number> {
  const frequencyMap = new Map<string, number>();
  for (const token of tokens) {
    frequencyMap.set(token, (frequencyMap.get(token) ?? 0) + 1);
  }
  for (const [term, count] of frequencyMap) {
    frequencyMap.set(term, count / tokens.length);
  }
  return frequencyMap;
}

/**
 * Builds an Inverse Document Frequency map across all documents.
 *
 * Uses smoothed IDF: `ln((N + 1) / (docCount + 1)) + 1` to avoid
 * division by zero and to dampen extremely rare terms.
 *
 * @param tokenizedDocuments - Each element is the token list for one document.
 * @returns A map from term → IDF weight.
 */
function buildInverseDocumentFrequency(tokenizedDocuments: string[][]): Map<string, number> {
  const totalDocuments = tokenizedDocuments.length;
  const documentFrequency = new Map<string, number>();

  for (const tokens of tokenizedDocuments) {
    const uniqueTerms = new Set(tokens);
    for (const term of uniqueTerms) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  const idfWeights = new Map<string, number>();
  for (const [term, docCount] of documentFrequency) {
    idfWeights.set(term, Math.log((totalDocuments + 1) / (docCount + 1)) + 1);
  }
  return idfWeights;
}

/**
 * Projects a document's term-frequency map into a fixed-length TF-IDF vector.
 *
 * Each dimension corresponds to a term in the shared vocabulary.
 * The value is `TF(term) × IDF(term)`, or 0 if the term is absent.
 *
 * @param termFrequency - The document's normalised term-frequency map.
 * @param idfWeights    - The corpus-wide IDF weights.
 * @param vocabulary    - The ordered list of all terms (defines vector dimensions).
 */
function buildTfidfVector(
  termFrequency: Map<string, number>,
  idfWeights: Map<string, number>,
  vocabulary: string[],
): number[] {
  return vocabulary.map(term =>
    (termFrequency.get(term) ?? 0) * (idfWeights.get(term) ?? 0)
  );
}

/**
 * Computes the cosine similarity between two equal-length vectors.
 *
 * Returns a value between 0 (orthogonal / no similarity) and 1 (identical direction).
 * Returns 0 if either vector has zero magnitude.
 */
function computeCosineSimilarity(vectorA: number[], vectorB: number[]): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

/**
 * Concatenates a film's textual fields into a single searchable document.
 *
 * Combines the editorial critique, synopsis, genre labels, and short
 * description so that TF-IDF can capture both thematic and genre signals.
 */
function buildSearchableDocument(film: FilmData): string {
  return [film.critique, film.synopsis, film.genres.join(' '), film.description].join(' ');
}

/**
 * Finds the most semantically distinctive terms shared between two token sets.
 *
 * Shared terms are ranked by their IDF weight — rarer terms score higher
 * because they are more thematically distinctive.
 *
 * @param queryTokens     - Tokens from the query (unavailable) film.
 * @param candidateTokens - Tokens from a candidate (available) film.
 * @param idfWeights      - Corpus-wide IDF weights used for ranking.
 * @param maxTerms        - Maximum number of shared terms to return.
 */
function findSharedThemes(
  queryTokens: string[],
  candidateTokens: string[],
  idfWeights: Map<string, number>,
  maxTerms = 3,
): string[] {
  const queryTermSet = new Set(queryTokens);
  const candidateTermSet = new Set(candidateTokens);
  const sharedTerms = [...queryTermSet].filter(term => candidateTermSet.has(term));

  return sharedTerms
    .sort((a, b) => (idfWeights.get(b) ?? 0) - (idfWeights.get(a) ?? 0))
    .slice(0, maxTerms);
}

/**
 * Maps raw thematic tokens to human-readable phrases.
 *
 * For example, the token "noir" becomes "noir atmosphere" and "institution"
 * becomes "institutions". Used when generating recommendation reason text.
 */
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

/**
 * Generates a human-readable explanation for why a candidate film was
 * recommended based on the unavailable query film.
 *
 * Tries three strategies in order:
 *   1. If two or more shared thematic phrases exist, cites them both.
 *   2. If exactly one shared theme exists, names it.
 *   3. Falls back to shared genre labels, or a generic rationale.
 *
 * @param queryFilm   - The unavailable film the user wanted to watch.
 * @param candidate   - The available film being recommended.
 * @param sharedTerms - The highest-IDF terms shared between both films.
 */
function generateReasonText(
  queryFilm: FilmData,
  candidate: FilmData,
  sharedTerms: string[],
): string {
  const phrases = [
    ...new Set(
      sharedTerms
        .map(term => THEME_PHRASES[term])
        .filter(Boolean)
    )
  ];

  if (phrases.length >= 2) {
    return `Like ${queryFilm.title}, this film explores themes of ${phrases[0]} and ${phrases[1]} with a similarly assured sense of craft.`;
  }
  if (phrases.length === 1) {
    return `Shares ${queryFilm.title}'s preoccupation with ${phrases[0]}, brought to life through bold and distinctive filmmaking.`;
  }

  const sharedGenres = queryFilm.genres.filter(genre =>
    candidate.genres.some(candidateGenre => candidateGenre.toLowerCase() === genre.toLowerCase())
  );
  if (sharedGenres.length > 0) {
    return `A compelling ${sharedGenres[0].toLowerCase()} film with the same emotional intensity and artistic rigour as ${queryFilm.title}.`;
  }

  return `Selected for its thematic resonance with ${queryFilm.title} — a film that shares its commitment to authentic, uncompromising storytelling.`;
}

/**
 * Finds the top-N available films most similar to an unavailable query film.
 *
 * Uses a TF-IDF / cosine-similarity pipeline:
 *   1. Builds a searchable document for each film (critique + synopsis + genres + description).
 *   2. Tokenizes every document and computes corpus-wide IDF weights.
 *   3. Converts each document to a TF-IDF vector in the shared vocabulary space.
 *   4. Ranks candidates by cosine similarity to the query film's vector.
 *   5. Generates a human-readable reason for each recommendation using shared themes.
 *
 * @param queryFilm      - The film the user wanted but is no longer available.
 * @param availableFilms - The current catalogue of streamable films.
 * @param topN           - How many recommendations to return (default 3).
 * @returns An array of recommendations sorted by descending similarity score.
 */
export function getRecommendations(
  queryFilm: FilmData,
  availableFilms: FilmData[],
  topN = 3,
): Recommendation[] {
  const candidates = availableFilms.filter(film => film.id !== queryFilm.id);
  if (candidates.length === 0) return [];

  // Combine query + candidates into one corpus for IDF calculation.
  const allFilms = [queryFilm, ...candidates];
  const tokenizedDocuments = allFilms.map(film => tokenize(buildSearchableDocument(film)));
  const idfWeights = buildInverseDocumentFrequency(tokenizedDocuments);

  // The ordered vocabulary defines each dimension of the TF-IDF vectors.
  const vocabulary = [...idfWeights.keys()];

  const queryTermFrequency = computeTermFrequency(tokenizedDocuments[0]);
  const queryVector = buildTfidfVector(queryTermFrequency, idfWeights, vocabulary);
  const queryTokens = tokenizedDocuments[0];

  const scoredCandidates = candidates.map((film, candidateIndex) => {
    const candidateTermFrequency = computeTermFrequency(tokenizedDocuments[candidateIndex + 1]);
    const candidateVector = buildTfidfVector(candidateTermFrequency, idfWeights, vocabulary);
    const similarityScore = computeCosineSimilarity(queryVector, candidateVector);
    const sharedTerms = findSharedThemes(queryTokens, tokenizedDocuments[candidateIndex + 1], idfWeights);
    const reason = generateReasonText(queryFilm, film, sharedTerms);
    return { film, reason, score: similarityScore };
  });

  return scoredCandidates
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
