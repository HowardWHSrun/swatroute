"use client";

import useSWR from "swr";
import { Container, Typography, Card, CardContent, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import ClientMap from "@/components/ClientMap";
import HexagonRadar from "@/components/HexagonRadar";
import { getStoredRoutes, StoredRoute } from "@/lib/localStorage";

type RouteRow = {
  id: string;
  title: string;
  author: string;
  polyline: string; // JSON string
  traffic: number;
  elevation: number;
  scenic: number;
  surface: number;
  safety: number;
  access: number;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function RoutesPage() {
  const { data: apiData, error } = useSWR<RouteRow[]>("/api/routes", fetcher);
  const [localData, setLocalData] = useState<StoredRoute[]>([]);

  useEffect(() => {
    setLocalData(getStoredRoutes());
  }, []);

  const data = apiData || localData;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Team Favorite Routes
      </Typography>
      {error && <Typography color="error">Failed to load routes</Typography>}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        {data?.map((r) => {
          const poly = JSON.parse(r.polyline) as [number, number][];
          return (
            <Card key={r.id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{r.title}</Typography>
                <Typography variant="body2" gutterBottom>
                  by {r.author}
                </Typography>
                <ClientMap polyline={poly} height={220} />
                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
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
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button href={`/routes/${r.id}`} size="small">Open</Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
}


