"use client";

import { useState } from "react";
import { Button, Container, Typography, Slider, Box, TextField } from "@mui/material";
import GpxPreview from "@/components/GpxPreview";
import HexagonRadar, { RatingKey } from "@/components/HexagonRadar";

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
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    traffic: 5,
    elevation: 5,
    scenic: 5,
    surface: 5,
    safety: 5,
    access: 5,
  });

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Swarthmore XC Routes
      </Typography>
      <Typography variant="body1" gutterBottom>
        Upload a GPX file and rate the route across six qualities.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <Box>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <TextField label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <Button variant="contained" component="label">
            Select GPX
            <input
              hidden
              type="file"
              accept=".gpx,application/gpx+xml"
              onChange={(e) => setFile(e.target.files?.[0] ?? undefined)}
            />
          </Button>
          <div style={{ marginTop: 16 }}>
            <GpxPreview file={file} />
          </div>
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            Ratings
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {ratingKeys.map((key) => (
              <Box key={key}>
                <Typography variant="body2" gutterBottom sx={{ textTransform: "capitalize" }}>
                  {key}
                </Typography>
                <Slider
                  value={ratings[key]}
                  step={1}
                  min={0}
                  max={10}
                  valueLabelDisplay="auto"
                  onChange={(_, v) =>
                    setRatings((prev) => ({ ...prev, [key]: Array.isArray(v) ? v[0] : v }))
                  }
                />
              </Box>
            ))}
          </Box>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <HexagonRadar ratings={ratings} />
          </div>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          disabled={!file || !title || !author}
          onClick={async () => {
            if (!file) return;
            const text = await file.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, "application/xml");
            const pts = Array.from(xml.querySelectorAll("trkpt"));
            const poly = pts
              .map((el) => [Number(el.getAttribute("lat")), Number(el.getAttribute("lon"))] as [number, number])
              .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon));
            await fetch("/api/routes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title,
                author,
                gpxText: text,
                polyline: poly,
                ratings,
              }),
            });
          }}
        >
          Save Route
        </Button>
        <Button href="/routes" variant="outlined">
          View All Routes
        </Button>
      </Box>
    </Container>
  );
}
