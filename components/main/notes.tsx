"use client";

import React, { useState } from "react";
import { Trash2, CheckCircle, Circle } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  completed?: boolean;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(() => {
    // Initialize state from localStorage
    try {
      const storedNotes = localStorage.getItem("notes");
      if (storedNotes) {
        const parsed = JSON.parse(storedNotes);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error("Error parsing notes from localStorage:", error);
    }
    return [];
  });

  // ✅ Toggle completion status
  const toggleComplete = (id: string) => {
    const updated = notes.map((note) =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
  };

  // ✅ Delete note
  const deleteNote = (id: string) => {
    const updated = notes.filter((note) => note.id !== id);
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold text-center mb-8">🗒 My Notes</h2>

      {notes.length === 0 ? (
        <p className="text-center text-neutral-500 dark:text-neutral-400">
          You haven&apos;t saved any notes yet.
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`flex items-center justify-between p-4 rounded-xl shadow-md border transition-all duration-200 ${
                note.completed
                  ? "bg-green-100 dark:bg-green-900/30 line-through opacity-70"
                  : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
              }`}
            >
              {/* Note Content */}
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => toggleComplete(note.id)}
              >
                {note.completed ? (
                  <CheckCircle className="text-green-500 transition-transform duration-200 scale-110" />
                ) : (
                  <Circle className="text-gray-400 hover:text-gray-500 transition-colors" />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{note.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 wrap-break-word max-w-xl">
                    {note.content}
                  </p>
                  {note.createdAt && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full"
                title="Delete note"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
