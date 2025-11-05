"use client";

import React, { useState } from "react";
import { Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
}

interface NotesPageProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({ notes, onEdit, onDelete }) => {
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          My Notes
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          View, edit, or delete your saved notes for future reference.
        </p>
      </div>

      {notes.length === 0 ? (
        <p className="text-center text-neutral-500 dark:text-neutral-400">
          You haven&apos;t saved any notes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notes.map((note) => {
            const isExpanded = expandedNoteId === note.id;
            return (
              <div
                key={note.id}
                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div
                  className="flex justify-between items-center"
                  onClick={() => toggleExpand(note.id)}
                >
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    {note.title}
                  </h3>
                  {isExpanded ? (
                    <ChevronUp className="text-neutral-600 dark:text-neutral-300" />
                  ) : (
                    <ChevronDown className="text-neutral-600 dark:text-neutral-300" />
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                      {note.content}
                    </p>

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => onEdit(note)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => onDelete(note.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};