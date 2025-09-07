"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ClientMap from "@/components/ClientMap";
import HexagonRadar from "@/components/HexagonRadar";
import { getStoredRoutes, StoredRoute } from "@/lib/localStorage";

type RouteRow = StoredRoute;

export default function RoutesPage() {
  const [data, setData] = useState<RouteRow[]>([]);
  useEffect(() => {
    setData(getStoredRoutes());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Team Favorite Routes
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.map((r) => {
          const poly = JSON.parse(r.polyline) as [number, number][];
          return (
            <Link key={r.id} href={`/routes/detail?id=${encodeURIComponent(r.id)}`} title={`Open ${r.title}`} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow transition-shadow">
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800">{r.title}</h2>
                <p className="text-gray-600 mb-4">by {r.author}</p>
              </div>
              <ClientMap polyline={poly} height={220} />
              <div className="flex justify-center mt-4 p-5 pt-3">
                <HexagonRadar
                  ratings={{
                    traffic: r.traffic,
                    elevation: r.elevation,
                    scenic: r.scenic,
                    surface: r.surface,
                    safety: r.safety,
                    access: r.access,
                  }}
                  size={200}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


