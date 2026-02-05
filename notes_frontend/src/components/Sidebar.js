import React, { useMemo } from "react";

/**
 * Sidebar note list item title helper.
 */
function getDisplayTitle(note) {
  const t = (note?.title || "").trim();
  return t.length > 0 ? t : "Untitled note";
}

// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  selectedNoteId,
  isLoading,
  onCreateNote,
  onSelectNote,
  onDeleteNote,
}) {
  const sortedNotes = useMemo(() => {
    // For now, keep stable ordering from state; later we can sort by updatedAt.
    return Array.isArray(notes) ? notes : [];
  }, [notes]);

  return (
    <aside className="notesSidebar" aria-label="Notes list">
      <div className="sidebarHeader">
        <div className="sidebarTitle">Your notes</div>
        <button
          className="btnPrimary btnSmall"
          onClick={onCreateNote}
          disabled={isLoading}
          aria-label="Create a new note"
          title="Create a new note"
          type="button"
        >
          + New
        </button>
      </div>

      <div className="sidebarBody">
        {isLoading ? (
          <div className="sidebarPlaceholder" role="status" aria-live="polite">
            Loading notes…
          </div>
        ) : sortedNotes.length === 0 ? (
          <div className="sidebarPlaceholder">No notes yet.</div>
        ) : (
          <ul className="notesList">
            {sortedNotes.map((note) => {
              const isActive = note.id === selectedNoteId;
              return (
                <li key={note.id} className="notesListItem">
                  <button
                    type="button"
                    className={`noteRow ${isActive ? "noteRowActive" : ""}`}
                    onClick={() => onSelectNote(note.id)}
                    aria-current={isActive ? "true" : "false"}
                  >
                    <div className="noteRowTitle">{getDisplayTitle(note)}</div>
                    <div className="noteRowMeta">
                      {note.updatedAt
                        ? new Date(note.updatedAt).toLocaleString()
                        : ""}
                    </div>
                  </button>

                  <button
                    type="button"
                    className="iconButton"
                    onClick={() => onDeleteNote(note.id)}
                    aria-label={`Delete note "${getDisplayTitle(note)}"`}
                    title="Delete note"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
