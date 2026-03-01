"use client";

import { useState } from "react";
import { NoteCreateRequest } from "@/types";

interface NoteFormProps {
  onSubmit: (data: NoteCreateRequest) => Promise<void>;
  encounterId?: number;
}

export default function NoteForm({ onSubmit }: NoteFormProps) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ content, author });
      setContent("");
      setAuthor("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
        <input
          type="text"
          required
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
        <textarea
          required
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter clinical note..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-slate-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add Note"}
      </button>
    </form>
  );
}
