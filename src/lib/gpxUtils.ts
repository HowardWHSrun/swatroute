// Thin GPX points to reduce rendering load while preserving route shape
export function thinGpxPoints(points: [number, number][], maxPoints = 500): [number, number][] {
  if (points.length <= maxPoints) return points;
  
  // Keep first and last points, sample evenly from the middle
  const step = Math.floor((points.length - 2) / (maxPoints - 2));
  const thinned: [number, number][] = [points[0]];
  
  for (let i = step; i < points.length - 1; i += step) {
    thinned.push(points[i]);
  }
  
  thinned.push(points[points.length - 1]);
  return thinned;
}

// Parse GPX with better error handling and point optimization
export function parseGpxText(text: string): { polyline: [number, number][]; center: [number, number] } {
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "application/xml");
  
  let pts: Element[] = Array.from(xml.getElementsByTagName("trkpt"));
  if (pts.length === 0) {
    try {
      pts = Array.from(xml.getElementsByTagNameNS("*", "trkpt"));
    } catch {}
  }
  if (pts.length === 0) {
    pts = Array.from(xml.querySelectorAll("[lat][lon]"));
  }
  
  const allPoints = pts
    .map((el) => [Number(el.getAttribute("lat")), Number(el.getAttribute("lon"))] as [number, number])
    .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon));
  
  // Thin points for performance
  const polyline = thinGpxPoints(allPoints);
  const center: [number, number] = polyline.length > 0 ? polyline[0] : [39.905, -75.353];
  
  return { polyline, center };
}




