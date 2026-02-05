import React from "react";

/**
 * AppHeader
 * Simple top header bar for the notes app.
 */
// PUBLIC_INTERFACE
export default function AppHeader({ isLoading, errorMessage }) {
  return (
    <header className="appHeader">
      <div className="appHeaderLeft">
        <div className="appTitle">Notes</div>
        <div className="appSubtitle">Create, edit, and organize your notes</div>
      </div>

      <div className="appHeaderRight" aria-label="App status">
        {isLoading ? (
          <span className="statusPill statusPillLoading">Loading</span>
        ) : errorMessage ? (
          <span className="statusPill statusPillError">Error</span>
        ) : (
          <span className="statusPill statusPillReady">Ready</span>
        )}
      </div>
    </header>
  );
}
