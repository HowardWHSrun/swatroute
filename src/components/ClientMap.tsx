"use client";

import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import { useMemo } from "react";
const LeafletMapInner = dynamic(() => import("@/components/LeafletMapInner"), {
  ssr: false,
});

export type ClientMapProps = {
  polyline?: LatLngExpression[];
  height?: number | string;
  center?: [number, number];
  zoom?: number;
};

export default function ClientMap({
  polyline,
  height = 320,
  center,
  zoom = 13,
}: ClientMapProps) {
  const computedCenter = useMemo<[number, number] | undefined>(() => {
    if (center) return center;
    if (polyline && polyline.length > 0) {
      const first = polyline[0] as [number, number];
      return [first[0], first[1]];
    }
    return [39.905, -75.353];
  }, [center, polyline]);

  return <LeafletMapInner polyline={polyline} height={height} center={computedCenter as [number, number]} zoom={zoom} />;
}


