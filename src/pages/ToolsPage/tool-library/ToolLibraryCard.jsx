export function ToolLibraryCard({ section, onLibraryDragStart, onDragEnd }) {
  return (
    <article
      className="feature-card feature-card--draggable"
      draggable
      onDragStart={(event) => onLibraryDragStart(event, section)}
      onDragEnd={onDragEnd}
    >
      <div className="feature-card-meta">
        <span className="status-pill">{section.status}</span>
      </div>
      <h3>{section.title}</h3>
      <p>{section.description}</p>
      <div className="feature-placeholder" aria-hidden="true">
        <div className="placeholder-line" />
        <div className="placeholder-line placeholder-line--short" />
        <div className="placeholder-box" />
      </div>
    </article>
  );
}
