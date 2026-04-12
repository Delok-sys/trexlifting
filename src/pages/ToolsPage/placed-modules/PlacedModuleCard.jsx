export function PlacedModuleCard({
  module,
  isDragging,
  moduleContent,
  onPlacedDragStart,
  onDragEnd,
  onPlacedReorder,
  onRemoveModule,
}) {
  return (
    <article
      className={isDragging ? "feature-card feature-card--placed is-dragging" : "feature-card feature-card--placed"}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onPlacedReorder(event, module.instanceId)}
    >
      <div className="feature-card-meta">
        <span className="status-pill">{module.instanceLabel}</span>
        <div className="tools-module-actions">
          <span
            className="status-pill status-pill--drag"
            draggable
            onDragStart={(event) => onPlacedDragStart(event, module)}
            onDragEnd={onDragEnd}
          >
            Verschieben
          </span>
          <button
            type="button"
            className="button button--ghost button--small"
            onClick={() => onRemoveModule(module.instanceId)}
          >
            Entfernen
          </button>
        </div>
      </div>

      <h3>{module.title}</h3>
      <p>{module.description}</p>
      {moduleContent}
    </article>
  );
}
