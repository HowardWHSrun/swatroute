"use client";

import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

export type LeafletMapInnerProps = {
  polyline?: LatLngExpression[];
  height?: number | string;
  center: [number, number];
  zoom?: number;
};

export default function LeafletMapInner({
  polyline,
  height = 320,
  center,
  zoom = 13,
}: LeafletMapInnerProps) {
  return (
    <div style={{ width: "100%", height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {polyline && polyline.length > 0 ? (
          <Polyline positions={polyline} color="#ef4444" weight={4} />
        ) : null}
      </MapContainer>
    </div>
  );
}


