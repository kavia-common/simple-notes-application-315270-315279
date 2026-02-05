import React, { useMemo, useState } from "react";
import "./App.css";
import AppHeader from "./components/AppHeader";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";

/**
 * Generate a reasonably unique ID for in-memory notes.
 * We avoid external dependencies because API wiring will come later.
 */
function generateId() {
  return `note_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * Initial mock notes shown before API wiring exists.
 */
function getMockNotes() {
  const now = Date.now();
  return [
    {
      id: generateId(),
      title: "Welcome",
      content:
        "This is a simple notes app. Select a note on the left, or create a new one.",
      updatedAt: new Date(now - 1000 * 60 * 20).toISOString(),
    },
    {
      id: generateId(),
      title: "Quick tips",
      content:
        "• Create a note with the + button\n• Edit title and content\n• Delete a note from the sidebar\n\nAPI wiring will be added later.",
      updatedAt: new Date(now - 1000 * 60 * 5).toISOString(),
    },
  ];
}

// PUBLIC_INTERFACE
function App() {
  /** notes: array of {id, title, content, updatedAt} (in-memory for now) */
  const [notes, setNotes] = useState(() => getMockNotes());
  const [selectedNoteId, setSelectedNoteId] = useState(
    () => getMockNotes()[0]?.id
  );

  // UI state placeholders for upcoming async API integration
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  const clearErrorSoon = () => {
    // Clear transient errors after a short time
    window.setTimeout(() => setErrorMessage(""), 2500);
  };

  // PUBLIC_INTERFACE
  const handleSelectNote = (noteId) => {
    setSelectedNoteId(noteId);
  };

  // PUBLIC_INTERFACE
  const handleCreateNote = () => {
    // Optimistic UX: create immediately in local state
    const newNote = {
      id: generateId(),
      title: "Untitled note",
      content: "",
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);

    // Placeholder for future API call
    // setIsLoading(true); ... await createNote(newNote) ...
  };

  // PUBLIC_INTERFACE
  const handleDeleteNote = (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    const ok = window.confirm(
      `Delete "${note?.title || "this note"}"? This cannot be undone.`
    );
    if (!ok) return;

    // Optimistic delete
    setNotes((prev) => prev.filter((n) => n.id !== noteId));

    // If the deleted note was selected, pick another note (or empty)
    setSelectedNoteId((prevSelected) => {
      if (prevSelected !== noteId) return prevSelected;
      const remaining = notes.filter((n) => n.id !== noteId);
      return remaining[0]?.id || "";
    });

    // Placeholder for future API call
  };

  // PUBLIC_INTERFACE
  const handleUpdateNote = ({ id, title, content }) => {
    if (!id) return;

    // Basic validation & error placeholder behavior
    if (typeof title !== "string" || typeof content !== "string") {
      setErrorMessage("Invalid note update payload.");
      clearErrorSoon();
      return;
    }

    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              title,
              content,
              updatedAt: new Date().toISOString(),
            }
          : n
      )
    );

    // Placeholder for future API call
  };

  return (
    <div className="notesApp">
      <AppHeader isLoading={isLoading} errorMessage={errorMessage} />

      <div className="notesLayout">
        <Sidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          isLoading={isLoading}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
        />

        <main className="notesMain" aria-label="Note editor">
          {isLoading ? (
            <div className="emptyState" role="status" aria-live="polite">
              <div className="emptyStateTitle">Loading…</div>
              <div className="emptyStateSubtitle">
                This will be connected to the backend API soon.
              </div>
            </div>
          ) : errorMessage ? (
            <div className="emptyState" role="alert">
              <div className="emptyStateTitle">Something went wrong</div>
              <div className="emptyStateSubtitle">{errorMessage}</div>
            </div>
          ) : selectedNote ? (
            <NoteEditor note={selectedNote} onChange={handleUpdateNote} />
          ) : notes.length === 0 ? (
            <div className="emptyState">
              <div className="emptyStateTitle">No notes yet</div>
              <div className="emptyStateSubtitle">
                Create your first note from the sidebar.
              </div>
              <button className="btnPrimary" onClick={handleCreateNote}>
                + Create note
              </button>
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptyStateTitle">Select a note</div>
              <div className="emptyStateSubtitle">
                Choose a note from the sidebar to view and edit it.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
