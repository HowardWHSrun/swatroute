"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import GpxPreview from "@/components/GpxPreview";
import HexagonRadar, { RatingKey } from "@/components/HexagonRadar";
import { parseGpxText } from "@/lib/gpxUtils";
import { saveRoute, getStoredRoutes } from "@/lib/localStorage";

const ratingKeys: RatingKey[] = [
  "traffic",
  "elevation",
  "scenic",
  "surface",
  "safety",
  "access",
];

export default function Home() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    traffic: 5,
    elevation: 5,
    scenic: 5,
    surface: 5,
    safety: 5,
    access: 5,
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Seed localStorage with bundled GPX routes on first load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seededKey = "seededRoutesV1";
    const alreadySeeded = localStorage.getItem(seededKey);
    const existing = getStoredRoutes();
    if (alreadySeeded || (existing && existing.length > 0)) return;

    const baseFromEnv = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const baseFromRuntime = (globalThis as unknown as { __NEXT_DATA__?: { assetPrefix?: string } })?.__NEXT_DATA__?.assetPrefix || "";
    const base = baseFromEnv || baseFromRuntime || "";
    const seeds = [
      { path: `${base}/Afternoon_Run.gpx`, title: "Afternoon Run", author: "Seed" },
      { path: `${base}/Morning_Run.gpx`, title: "Morning Run", author: "Seed" },
    ];
    (async () => {
      try {
        for (const s of seeds) {
          const res = await fetch(s.path);
          if (!res.ok) continue;
          const text = await res.text();
          const { polyline } = parseGpxText(text);
          saveRoute({
            title: s.title,
            author: s.author,
            gpxText: text,
            polyline: JSON.stringify(polyline),
            traffic: 5,
            elevation: 5,
            scenic: 5,
            surface: 5,
            safety: 5,
            access: 5,
          });
        }
        localStorage.setItem(seededKey, "1");
      } catch {}
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">
        Swarthmore XC Routes
      </h1>
      <p className="text-gray-600 mb-8">
        Upload a GPX file and rate the route across six qualities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
          <input
            type="text"
            placeholder="Route Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const f = e.dataTransfer.files?.[0];
              if (f) setFile(f);
            }}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <svg className="w-9 h-9 mb-2 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 15.5v-6m0 0 2.5 2.5M12 9.5 9.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-gray-600">Drag and drop GPX here, or click to browse</p>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept=".gpx,application/gpx+xml"
              onChange={(e) => setFile(e.target.files?.[0] ?? undefined)}
            />
          </div>

          <div className="mt-4">
            <GpxPreview file={file} />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Ratings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ratingKeys.map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key}: {ratings[key]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={ratings[key]}
                  onChange={(e) =>
                    setRatings((prev) => ({ ...prev, [key]: parseInt(e.target.value) }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <HexagonRadar ratings={ratings} />
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <button
          disabled={!file || !title || !author}
          onClick={async () => {
            if (!file) return;
            setSaving(true);
            const text = await file.text();
            const { polyline: poly } = parseGpxText(text);
            try {
              saveRoute({
                title,
                author,
                gpxText: text,
                polyline: JSON.stringify(poly),
                traffic: ratings.traffic,
                elevation: ratings.elevation,
                scenic: ratings.scenic,
                surface: ratings.surface,
                safety: ratings.safety,
                access: ratings.access,
              });
              setSnack({ open: true, message: "Route saved!", severity: "success" });
              setTitle("");
              setAuthor("");
              setFile(undefined);
            } catch {
              setSnack({ open: true, message: "Save failed", severity: "error" });
            } finally {
              setSaving(false);
            }
          }}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !file || !title || !author
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save Route"}
        </button>
        <Link
          href="/routes"
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View All Routes
        </Link>
      </div>
      {snack.open && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white font-medium ${
          snack.severity === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {snack.message}
          <button 
            onClick={() => setSnack((s) => ({ ...s, open: false }))}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
