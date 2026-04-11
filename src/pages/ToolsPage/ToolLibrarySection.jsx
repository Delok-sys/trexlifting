import { ToolLibraryCard } from "./ToolLibraryCard";

export function ToolLibrarySection({ toolSections, onLibraryDragStart, onDragEnd }) {
  return (
    <section className="tools-workspace" aria-labelledby="tools-feature-area">
      <div className="page-section-head">
        <p className="section-kicker">Feature Bereich</p>
        <h2 id="tools-feature-area">Erste Module</h2>
      </div>

      <div className="card-grid">
        {toolSections.map((section) => (
          <ToolLibraryCard
            key={section.id}
            section={section}
            onLibraryDragStart={onLibraryDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </section>
  );
}
