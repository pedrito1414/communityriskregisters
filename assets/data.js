const base = new URL('../data/', import.meta.url);
let pending;
export function loadData() {
  if (!pending) pending = Promise.all(['forums.json', 'local-risks.json', 'national-risks.json', 'risk-matches.json', 'boundaries.geojson'].map(async name => {
    const response = await fetch(new URL(name, base));
    if (!response.ok) throw new Error(`Could not load ${name} (HTTP ${response.status}).`);
    return response.json();
  })).then(([forums, risks, nationalRisks, matches, boundaries]) => {
    if (!forums.length || !risks.length || !boundaries.features?.length) throw new Error('The shared dataset is empty or incomplete.');
    return {forums, risks, nationalRisks, matches, boundaries};
  }).catch(error => { pending = undefined; throw error; });
  return pending;
}
