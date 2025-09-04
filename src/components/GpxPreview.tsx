"use client";

import { useEffect, useMemo, useState, memo } from "react";
import ClientMap from "@/components/ClientMap";
import GPX from "gpxparser";
import { thinGpxPoints } from "@/lib/gpxUtils";

export type ParsedGpx = {
  polyline: [number, number][];
  center: [number, number];
};

function computeStats(line: [number, number][]) {
  // Haversine distance in meters
  const toRad = (d: number) => (d * Math.PI) / 180;
  let total = 0;
  for (let i = 1; i < line.length; i++) {
    const [lat1, lon1] = line[i - 1];
    const [lat2, lon2] = line[i];
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  const miles = total / 1609.344;
  return { meters: total, miles };
}

function GpxPreview({ file }: { file?: File }) {
  const [parsed, setParsed] = useState<ParsedGpx | null>(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      if (!file) {
        setParsed(null);
        return;
      }
      const text = await file.text();
      const gpx = new GPX();
      gpx.parse(text);
      const track = gpx.tracks?.[0];
      const segment = (track?.points as Array<{ lat: number; lon: number }> | undefined) ?? [];
      const allPoints: [number, number][] = segment.map((p) => [p.lat as number, p.lon as number]);
      // Thin points for performance
      const line = thinGpxPoints(allPoints);
      if (!canceled) {
        const center: [number, number] = line.length > 0 ? line[0] : [39.905, -75.353];
        setParsed({ polyline: line, center });
      }
    })();
    return () => {
      canceled = true;
    };
  }, [file]);

  const stats = useMemo(() => (parsed ? computeStats(parsed.polyline) : null), [parsed]);
  if (!parsed) return null;
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <ClientMap polyline={parsed.polyline} center={parsed.center} height={360} />
      {stats ? (
        <div style={{ fontSize: 13 }}>
          Distance: {stats.miles.toFixed(2)} mi ({Math.round(stats.meters)} m)
        </div>
      ) : null}
    </div>
  );
}

export default memo(GpxPreview);


