/**
 * "JAN 31" — no year, uppercase.
 * Used by CritiqueListPage.
 */
function shortDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

/**
 * "JAN 31, 2026" — uppercase with year.
 * Used by ViewCritiquePage.
 */
function longDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
}

/**
 * Format an ISO date string as "Jan 15, 2024".
 * Used by critique article generation.
 */
function formatPublishDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export { shortDate, longDate, formatPublishDate };
export default { shortDate, longDate, formatPublishDate };
