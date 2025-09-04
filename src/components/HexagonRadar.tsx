"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export type RatingKey = "traffic" | "elevation" | "scenic" | "surface" | "safety" | "access";

export type HexagonRadarProps = {
  ratings: Record<RatingKey, number>; // 0-10
  size?: number;
};

const ratingLabels: { key: RatingKey; label: string }[] = [
  { key: "traffic", label: "Traffic" },
  { key: "elevation", label: "Elevation" },
  { key: "scenic", label: "Scenic" },
  { key: "surface", label: "Surface" },
  { key: "safety", label: "Safety" },
  { key: "access", label: "Access" },
];

export default function HexagonRadar({ ratings, size = 280 }: HexagonRadarProps) {
  const data = ratingLabels.map(({ key, label }) => ({
    label,
    value: Math.max(0, Math.min(10, ratings[key] ?? 0)),
  }));

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="80%">
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis dataKey="label" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tickCount={6} />
          <Radar dataKey="value" stroke="#2563eb" fill="#60a5fa" fillOpacity={0.45} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}


