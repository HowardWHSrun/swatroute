"use client";

import { useEffect, useState } from "react";
import ClientMap from "@/components/ClientMap";
import GPX from "gpxparser";

export type ParsedGpx = {
  polyline: [number, number][];
  center: [number, number];
};

export default function GpxPreview({ file }: { file?: File }) {
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
      const line: [number, number][] = segment.map((p) => [p.lat as number, p.lon as number]);
      if (!canceled) {
        const center: [number, number] = line.length > 0 ? line[0] : [39.905, -75.353];
        setParsed({ polyline: line, center });
      }
    })();
    return () => {
      canceled = true;
    };
  }, [file]);

  if (!parsed) return null;
  return <ClientMap polyline={parsed.polyline} center={parsed.center} height={360} />;
}


