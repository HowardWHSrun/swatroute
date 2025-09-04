"use client";

import { useRef, useState } from "react";
import { Button, Container, Typography, Slider, Box, TextField, Snackbar, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

          <Box
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
            sx={{
              border: "2px dashed",
              borderColor: dragActive ? "primary.main" : "divider",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: dragActive ? "action.hover" : "transparent",
              display: "grid",
              gap: 1,
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <CloudUploadIcon color={dragActive ? "primary" : "action"} sx={{ fontSize: 36 }} />
            <Typography variant="body2">Drag and drop GPX here, or click to browse</Typography>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept=".gpx,application/gpx+xml"
              onChange={(e) => setFile(e.target.files?.[0] ?? undefined)}
            />
          </Box>

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
            setSaving(true);
            const text = await file.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, "application/xml");
            let pts: Element[] = Array.from(xml.getElementsByTagName("trkpt"));
            if (pts.length === 0) {
              try {
                pts = Array.from(xml.getElementsByTagNameNS("*", "trkpt"));
              } catch {}
            }
            if (pts.length === 0) {
              pts = Array.from(xml.querySelectorAll("[lat][lon]"));
            }
            const poly = pts
              .map((el) => [Number(el.getAttribute("lat")), Number(el.getAttribute("lon"))] as [number, number])
              .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon));
            try {
              const res = await fetch("/api/routes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, author, gpxText: text, polyline: poly, ratings }),
              });
              if (!res.ok) throw new Error("Failed to save");
              setSnack({ open: true, message: "Route saved!", severity: "success" });
              setTitle("");
              setAuthor("");
              setFile(undefined);
            } catch (e) {
              setSnack({ open: true, message: "Save failed", severity: "error" });
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving..." : "Save Route"}
        </Button>
        <Button href="/routes" variant="outlined">
          View All Routes
        </Button>
      </Box>
      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
