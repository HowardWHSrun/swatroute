"use client";

import { useState, useEffect } from "react";
import { getStoredComments, saveComment, StoredComment } from "@/lib/localStorage";

type Comment = {
  id: string;
  createdAt: string;
  author: string;
  body: string;
};

export default function CommentsSection({ routeId }: { routeId: string }) {
  const [localComments, setLocalComments] = useState<StoredComment[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLocalComments(getStoredComments(routeId));
  }, [routeId]);

  const data = localComments;

  const submit = async () => {
    if (!author || !body) return;
    setSubmitting(true);
    try {
      saveComment({ author, body, routeId });
      setLocalComments(getStoredComments(routeId));
      setAuthor("");
      setBody("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Comments</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <textarea
          placeholder="Add a comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
        />
        <button
          onClick={submit}
          disabled={!author || !body || submitting}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !author || !body || submitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </div>
      <div className="space-y-4 mt-6">
        {data?.map((c) => (
          <div key={c.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="font-semibold text-gray-800">{c.author}</div>
            <div className="text-sm text-gray-500 mb-2">
              {new Date(c.createdAt).toLocaleString()}
            </div>
            <div className="text-gray-700">
              {c.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


