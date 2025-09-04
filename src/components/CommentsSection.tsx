"use client";

import useSWR from "swr";
import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

type Comment = {
  id: string;
  createdAt: string;
  author: string;
  body: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CommentsSection({ routeId }: { routeId: string }) {
  const { data, mutate } = useSWR<Comment[]>(`/api/routes/${routeId}/comments`, fetcher);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!author || !body) return;
    setSubmitting(true);
    try {
      await fetch(`/api/routes/${routeId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, body }),
      });
      setAuthor("");
      setBody("");
      mutate();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 3, display: "grid", gap: 2 }}>
      <Typography variant="h6">Comments</Typography>
      <Box sx={{ display: "grid", gap: 1 }}>
        <TextField label="Your name" value={author} onChange={(e) => setAuthor(e.target.value)} size="small" />
        <TextField label="Comment" value={body} onChange={(e) => setBody(e.target.value)} multiline minRows={3} />
        <Button onClick={submit} disabled={!author || !body || submitting} variant="contained">
          {submitting ? "Posting..." : "Post Comment"}
        </Button>
      </Box>
      <Box sx={{ display: "grid", gap: 1 }}>
        {data?.map((c) => (
          <Box key={c.id} sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Typography variant="subtitle2">{c.author}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(c.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {c.body}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}


