// Point-in-polygon uses the same local ONS geometry that both maps display.
function inRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    const cross = (x - xi) * (yj - yi) - (y - yi) * (xj - xi);
    if (Math.abs(cross) < 1e-10 && x >= Math.min(xi, xj) - 1e-10 && x <= Math.max(xi, xj) + 1e-10 && y >= Math.min(yi, yj) - 1e-10 && y <= Math.max(yi, yj) + 1e-10) return true;
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function inPolygon(point, rings) {
  return inRing(point, rings[0]) && !rings.slice(1).some(ring => inRing(point, ring));
}
export function containsPoint(feature, point) {
  const geometry = feature.geometry;
  return geometry.type === 'Polygon' ? inPolygon(point, geometry.coordinates)
    : geometry.type === 'MultiPolygon' && geometry.coordinates.some(polygon => inPolygon(point, polygon));
}
export function findForumFeatures(collection, lon, lat) {
  return collection.features.filter(feature => containsPoint(feature, [lon, lat]));
}
export function drawFallbackMap(container, feature, point) {
  // Local SVG remains usable when the optional external basemap is unavailable.
  const ns = 'http://www.w3.org/2000/svg';
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  const factor = Math.cos(point[1] * Math.PI / 180);
  const project = ([lon, lat]) => [lon * factor, -lat];
  const points = polygons.flat(2).map(project);
  const marker = project(point); points.push(marker);
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const left = Math.min(...xs), top = Math.min(...ys), width = Math.max(...xs) - left, height = Math.max(...ys) - top;
  const pad = Math.max(width, height) * .08 || .01;
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `${left-pad} ${top-pad} ${width+pad*2} ${height+pad*2}`);
  svg.setAttribute('class', 'fallback-map'); svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${feature.properties.name} boundary and postcode location`);
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', polygons.map(polygon => polygon.map(ring => ring.map((p, i) => `${i ? 'L' : 'M'}${project(p).join(',')}`).join(' ') + 'Z').join(' ')).join(' '));
  path.setAttribute('fill-rule', 'evenodd'); path.setAttribute('fill', '#ce603122'); path.setAttribute('stroke', '#ce6031'); path.setAttribute('stroke-width', String(pad / 9));
  const dot = document.createElementNS(ns, 'circle'); dot.setAttribute('cx', marker[0]); dot.setAttribute('cy', marker[1]); dot.setAttribute('r', String(pad / 5)); dot.setAttribute('fill', '#103c48');
  svg.append(path, dot); container.replaceChildren(svg);
}
