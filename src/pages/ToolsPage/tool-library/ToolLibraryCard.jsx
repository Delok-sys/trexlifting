export function ModuleIcon({ moduleId }) {
  if (moduleId === "training-weight-range") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="10" width="16" height="4" rx="2" />
        <rect x="2" y="8" width="2" height="8" rx="1" />
        <rect x="20" y="8" width="2" height="8" rx="1" />
        <rect x="7" y="7" width="2" height="10" rx="1" />
        <rect x="15" y="7" width="2" height="10" rx="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4l7 4v4c0 4.6-3 7.9-7 9-4-1.1-7-4.4-7-9V8l7-4z" />
      <path d="M9.2 12.2l1.8 1.8 3.8-4" className="tools-module-icon-stroke" />
    </svg>
  );
}

export function ToolLibraryCard({ section, isActive, onOpen }) {
  return (
    <button
      type="button"
      className={isActive ? "tools-module-button is-active" : "tools-module-button"}
      onClick={onOpen}
      role="tab"
      id={`tools-module-tab-${section.id}`}
      aria-controls={`tools-module-panel-${section.id}`}
      aria-selected={isActive}
      aria-pressed={isActive}
      aria-expanded={isActive}
    >
      <span className="tools-module-icon">
        <ModuleIcon moduleId={section.id} />
      </span>
      <span className="tools-module-button-copy">
        <strong>{section.title}</strong>
        <span>{section.description}</span>
      </span>
      <span className="tools-module-button-meta">
        <span className="status-pill">{section.status}</span>
      </span>
    </button>
  );
}
