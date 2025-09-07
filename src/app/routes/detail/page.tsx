"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientMap from "@/components/ClientMap";
import HexagonRadar from "@/components/HexagonRadar";
import CommentsSection from "@/components/CommentsSection";
import { getStoredRoutes, StoredRoute } from "@/lib/localStorage";

function DetailInner() {
  const search = useSearchParams();
  const router = useRouter();
  const id = search.get("id") ?? undefined;
  const [route, setRoute] = useState<StoredRoute | null>(null);

  useEffect(() => {
    if (!id) return;
    const stored = getStoredRoutes();
    const found = stored.find((r) => r.id === id) || null;
    setRoute(found);
  }, [id]);

  const poly = useMemo<[number, number][]>(() => {
    if (!route) return [];
    try {
      return JSON.parse(route.polyline) as [number, number][];
    } catch {
      return [];
    }
  }, [route]);

  if (!id) return null;
  if (!route)
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-center">
          <div className="text-lg font-semibold text-gray-800 mb-1">Route not found</div>
          <div className="text-gray-600 mb-4">The route you selected is not in local storage.</div>
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={() => router.push("/routes")}
          >
            Back to Routes
          </button>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">{route.title}</h1>
      <p className="text-gray-600 mb-6">by {route.author}</p>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <ClientMap polyline={poly} height={420} />
        <div className="flex gap-2 p-5">
          <button
            onClick={() => {
              try {
                const blob = new Blob([route.gpxText], { type: "application/gpx+xml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${route.title.replace(/\s+/g, "_")}.gpx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 0);
              } catch {}
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Download GPX
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 mt-6 flex justify-center">
        <HexagonRadar
          ratings={{
            traffic: route.traffic,
            elevation: route.elevation,
            scenic: route.scenic,
            surface: route.surface,
            safety: route.safety,
            access: route.access,
          }}
          size={300}
        />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 mt-6">
        <CommentsSection routeId={route.id} />
      </div>
    </div>
  );
}

export default function RouteDetailPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 max-w-6xl">Loading…</div>}>
      <DetailInner />
    </Suspense>
  );
}


