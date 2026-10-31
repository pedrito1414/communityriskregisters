// Shared navigation rules, preserved from the original explorer.
// Categories are ordinal: these ranks are not measured probabilities.
export function ratingRank(value) {
  const text = String(value || '').trim().toLowerCase();
  for (const [prefix, rank] of [['very high', 5], ['high', 4], ['medium', 3], ['very low', 1], ['low', 2]]) {
    if (text.startsWith(prefix)) return rank;
  }
  // Critical, Severe and Moderate have source-specific meanings.
  return null;
}
export function calculatedPriority(risk) {
  return Number.isFinite(risk.likelihood) && Number.isFinite(risk.impact)
    ? risk.likelihood * risk.impact : null;
}
export function commonRanking(risk) {
  const category = ratingRank(risk.rating);
  if (category !== null) return category;
  const product = calculatedPriority(risk);
  if (product !== null) return Math.max(1, Math.ceil(product / 5));
  if (Number.isFinite(risk.visualRating)) return Math.max(1, Math.min(5, Math.round(risk.visualRating)));
  return null;
}
export function priorityCompare(a, b) {
  const aa = commonRanking(a), bb = commonRanking(b);
  if (aa === null && bb !== null) return 1;
  if (bb === null && aa !== null) return -1;
  if (aa !== null && bb !== null && aa !== bb) return bb - aa;
  const ap = calculatedPriority(a), bp = calculatedPriority(b);
  if (ap !== null && bp !== null && ap !== bp) return bp - ap;
  if (Number.isFinite(a.likelihood) && Number.isFinite(b.likelihood) && a.likelihood !== b.likelihood) return b.likelihood - a.likelihood;
  return a.name.localeCompare(b.name);
}
