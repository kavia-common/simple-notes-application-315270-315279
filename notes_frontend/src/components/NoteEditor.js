import React, { useEffect, useState } from "react";

/**
 * NoteEditor
 * Controlled editor for title and content. It keeps local input state for snappy typing
 * and forwards changes up to parent for optimistic persistence.
 */
// PUBLIC_INTERFACE
export default function NoteEditor({ note, onChange }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  // When selection changes, refresh local editor state
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]); // intentionally keying on id to avoid overwriting during typing

  const emitChange = (nextTitle, nextContent) => {
    onChange({
      id: note.id,
      title: nextTitle,
      content: nextContent,
    });
  };

  return (
    <section className="editorPanel">
      <div className="editorHeader">
        <div className="editorHeading">Editor</div>
        <div className="editorHint">
          Changes are saved locally for now (API wiring later).
        </div>
      </div>

      <label className="fieldLabel" htmlFor="note-title">
        Title
      </label>
      <input
        id="note-title"
        className="textInput"
        type="text"
        value={title}
        onChange={(e) => {
          const next = e.target.value;
          setTitle(next);
          emitChange(next, content);
        }}
        placeholder="Untitled note"
        autoComplete="off"
      />

      <label className="fieldLabel" htmlFor="note-content">
        Content
      </label>
      <textarea
        id="note-content"
        className="textArea"
        value={content}
        onChange={(e) => {
          const next = e.target.value;
          setContent(next);
          emitChange(title, next);
        }}
        placeholder="Write your note here…"
        rows={14}
      />
    </section>
  );
}
