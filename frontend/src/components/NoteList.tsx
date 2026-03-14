"use client";

import { Note } from "@/types";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return <p className="text-gray-500 text-sm">No notes yet.</p>;
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="prose prose-sm max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: note.content }} />
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <span className="font-medium text-gray-700">{note.author}</span>
            <span>{new Date(note.createdAt).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
